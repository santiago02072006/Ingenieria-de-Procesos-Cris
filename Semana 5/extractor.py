import json
import os
import sys
import requests
from datetime import datetime
import argparse
from dotenv import load_dotenv
load_dotenv()

# --- CONFIGURACIÓN GLOBAL ---
HENRIK_API_KEY = os.getenv("HENRIK_API_KEY")
HISTORIAL_FILE = "data/ultimo_match.json"

CUENTAS = {
    "las": {"name": "Santrax0207", "tag": "Dev", "region": "latam"},
    "na": {"name": "BadEnglishGuy", "tag": "CHILL", "region": "na"}
}

ARMAS_MAPEO = {
    "9c82e19d-4575-0200-1a81-3eacf00cf872": "Vandal",
    "ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a": "Phantom",
    "ec845bf4-4f79-ddda-a3da-0db3774b2794": "Classic",
    "ae3de142-4d85-253a-73c2-879663dae823": "Spectre",
    "55d8a0f4-4274-ca67-e3ef-41a6ee9c3a50": "Operator",
    "c4883e50-4103-999c-ed90-19a5ff581572": "Marshal",
    "29a0ba7e-42c0-de1c-2757-259e7f225de2": "Ghost",
    "42da8c53-48b4-040d-aa3a-a9a43312c2c4": "Sheriff",
    "1baa85b4-4c70-1284-6d9b-43ac5687459f": "Stinger",
    "e336d3e7-4f53-b5b2-ab16-53874d416c67": "Odin",
    "4625211e-4283-f28e-63c3-139fe2468c30": "Judge",
    "f7e73013-447a-1154-4336-019744d95074": "Bucky",
    "44d13435-434b-bc29-f713-ab89643d45c1": "Frenzy",
    "ab3718c4-483e-7747-e736-e1a3f741c118": "Bulldog",
    "a03b24d3-4319-996d-0f8c-94bbfba1dfc7": "Ares",
    "2f59173c-433b-859a-ac2b-42acdfc900e9": "Cuchillo",
    "6010edd5-46da-793a-a40c-5fae655c7a38": "Outlaw"
}

# --- GESTIÓN DE APIS Y PERSISTENCIA ---

def obtener_historial_web(cuenta):
    url = f"https://api.henrikdev.xyz/valorant/v1/lifetime/matches/{cuenta['region']}/{cuenta['name']}/{cuenta['tag']}"
    headers = {"Authorization": HENRIK_API_KEY}
    try:
        respuesta = requests.get(url, headers=headers, timeout=10)
        respuesta.raise_for_status()
        return respuesta.json().get("data", [])
    except requests.exceptions.RequestException as e:
        print(f"❌ Error al conectar con la API de Lifetime: {e}")
        return []

def obtener_detalles_partida_web(match_id):
    url = f"https://api.henrikdev.xyz/valorant/v2/match/{match_id}"
    headers = {"Authorization": HENRIK_API_KEY}
    try:
        respuesta = requests.get(url, headers=headers, timeout=10)
        respuesta.raise_for_status()
        return respuesta.json().get("data", {})
    except requests.exceptions.RequestException as e:
        print(f"❌ Error al descargar detalles de la partida {match_id}: {e}")
        return None

def cargar_registro_local():
    if os.path.exists(HISTORIAL_FILE):
        try:
            with open(HISTORIAL_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def guardar_registro_local(registro):
    with open(HISTORIAL_FILE, "w", encoding="utf-8") as f:
        json.dump(registro, f, indent=4, ensure_ascii=False)

# --- HELPERS ---

def resolver_arma(eco):
    """Resuelve el nombre del arma desde el objeto economía de una ronda."""
    weapon_info = eco.get("weapon", {})
    if isinstance(weapon_info, dict):
        nombre = weapon_info.get("name", "")
    else:
        nombre = eco.get("weapon_name", "")

    if not nombre or nombre == "Pistola / Compras":
        arma_id = eco.get("weapon_id", "")
        nombre = ARMAS_MAPEO.get(str(arma_id).lower(), "Pistola / Compras")

    return nombre or "Pistola / Compras"


def extraer_kills_ronda(kill_events, mi_puuid, mi_nombre_clean):
    """
    Extrae el detalle de cada baja conseguida en una ronda.
    Devuelve una lista con timing, víctima y tipo de daño final.
    """
    bajas = []
    for kill in kill_events:
        killer_puuid = kill.get("killer_puuid", kill.get("killer", ""))
        killer_name  = kill.get("killer_display_name", "").lower()

        if (mi_puuid and killer_puuid == mi_puuid) or (killer_name == mi_nombre_clean):
            finishing = kill.get("finishing_damage", {})
            bajas.append({
                "tiempo_ms_en_ronda": kill.get("round_time_millis", kill.get("round_time", 0)),
                "victima": kill.get("victim_display_name", kill.get("victim", "Desconocido")),
                "tipo_dano_final": finishing.get("damage_type", "Desconocido"),
                "arma_baja": finishing.get("damage_item", finishing.get("secondary_fire_mode", "")),
                "asistentes": kill.get("assistants", []),
            })
    return bajas


def extraer_spike_info(ronda):
    """
    Extrae información de plantada y desactivación de spike de la ronda.
    """
    plantada = ronda.get("bomb_planted", False)
    desactivada = ronda.get("bomb_defused", False)

    sitio = None
    quien_planto = None
    tiempo_plantada_ms = None

    if plantada:
        plant = ronda.get("plant_events", {}) or {}
        sitio = plant.get("plant_site", plant.get("site", None))
        quien_planto = plant.get("planted_by", {})
        if isinstance(quien_planto, dict):
            quien_planto = quien_planto.get("display_name", quien_planto.get("puuid", None))
        tiempo_plantada_ms = plant.get("plant_time_millis", plant.get("round_time", None))

    return {
        "spike_plantada": plantada,
        "spike_desactivada": desactivada,
        "sitio_plantada": sitio,
        "quien_planto": quien_planto,
        "tiempo_plantada_ms": tiempo_plantada_ms,
    }


# --- PROCESAMIENTO PRINCIPAL ---

def limpiar_json_henrik(data_partida, mi_nombre_usuario):
    if not data_partida:
        return None

    mi_nombre_clean = mi_nombre_usuario.strip().lower()

    # =========================================================
    # 1. METADATOS DE LA PARTIDA
    # =========================================================
    metadata = data_partida.get("metadata", {})
    mapa = metadata.get("map", "Desconocido")

    modo_raw = metadata.get("queue", metadata.get("mode", "Competitive"))
    if not modo_raw or str(modo_raw).lower() == "standard":
        modo_raw = metadata.get("mode_id", metadata.get("queue_id", "Competitive"))
    modo = str(modo_raw).capitalize()
    if modo.lower() == "unrated":
        modo = "Unrated"
    elif "comp" in modo.lower():
        modo = "Competitive"

    duracion_min = metadata.get("game_length", 0) // 60
    rondas = data_partida.get("rounds", [])
    total_rondas = len(rondas)

    # =========================================================
    # 2. RESULTADO FINAL DEL EQUIPO (desde teams)
    # =========================================================
    teams_data = data_partida.get("teams", {})
    resultado_final = "Desconocido"
    marcador = {"mi_equipo": 0, "rival": 0}
    mi_equipo_id = ""  # se llenará al identificar al jugador

    # (Se completa después de identificar al jugador — ver paso 3)

    # =========================================================
    # 3. IDENTIFICACIÓN DEL JUGADOR EN all_players
    # =========================================================
    mis_stats_globales = {}
    mi_puuid = ""
    all_players = data_partida.get("players", {}).get("all_players", [])

    for jugador in all_players:
        if jugador.get("name", "").lower() == mi_nombre_clean:
            mi_equipo_id  = jugador.get("team", "").lower()
            mi_puuid      = jugador.get("puuid", "")
            stats         = jugador.get("stats", {})
            rango_actual  = jugador.get("currenttier_patched", "No rankeado")

            # --- Habilidades (total partida, única fuente fiable) ---
            ac = jugador.get("ability_casts", {}) or {}
            habilidades = {
                "Habilidad_C": ac.get("c_cast", 0) or 0,
                "Habilidad_Q": ac.get("q_cast", 0) or 0,
                "Habilidad_E": ac.get("e_cast", 0) or 0,
                "Definitiva_X": ac.get("x_cast", 0) or 0,
            }

            # --- Comportamiento (AFK, fuego amigo, rondas en spawn) ---
            behav = jugador.get("behavior", {}) or {}
            ff    = behav.get("friendly_fire", {}) or {}
            comportamiento = {
                "rondas_afk":          behav.get("afk_rounds", 0),
                "rondas_en_spawn":     behav.get("rounds_in_spawn", 0),
                "fuego_amigo_dado":    ff.get("outgoing", 0),
                "fuego_amigo_recibido": ff.get("incoming", 0),
            }

            # --- Economía global ---
            eco_global = jugador.get("economy", {}) or {}
            spent       = eco_global.get("spent", {}) or {}
            loadout_val = eco_global.get("loadout_value", {}) or {}
            economia_global = {
                "creditos_gastados_total":       spent.get("overall", 0),
                "creditos_gastados_promedio":     spent.get("average", 0),
                "valor_loadout_total":            loadout_val.get("overall", 0),
                "valor_loadout_promedio":         loadout_val.get("average", 0),
            }

            # --- Daño global (referencia rápida; ADR preciso se calcula abajo) ---
            dano_hecho    = jugador.get("damage_made", 0)
            dano_recibido = jugador.get("damage_received", 0)

            # --- Stats de combate ---
            puntuacion_combate = jugador.get("score", stats.get("score", 0)) // max(1, total_rondas)
            headshots  = stats.get("headshots", 0)
            bodyshots  = stats.get("bodyshots", 0)
            legshots   = stats.get("legshots", 0)
            total_hits = headshots + bodyshots + legshots

            mis_stats_globales = {
                "rango_actual":              rango_actual,
                "agente":                    jugador.get("character", "Desconocido"),
                "puntuacion_combate_promedio": puntuacion_combate,
                "bajas":                     stats.get("kills", 0),
                "muertes":                   stats.get("deaths", 0),
                "asistencias":               stats.get("assists", 0),
                "headshots":                 headshots,
                "bodyshots":                 bodyshots,
                "legshots":                  legshots,
                "porcentaje_headshot":       round((headshots / total_hits) * 100, 2) if total_hits > 0 else 0,
                "dano_hecho_total":          dano_hecho,
                "dano_recibido_total":       dano_recibido,
                # ADR preciso se sobreescribirá abajo tras iterar rondas
                "ADR": 0,
                "uso_habilidades_total_partida": habilidades,
                "comportamiento":            comportamiento,
                "economia_global":           economia_global,
            }
            break

    # =========================================================
    # 4. RESULTADO FINAL (ahora que sabemos mi_equipo_id)
    # =========================================================
    equipo_rival_id = "blue" if mi_equipo_id == "red" else "red"

    mi_team_data     = teams_data.get(mi_equipo_id, teams_data.get(mi_equipo_id.capitalize(), {}))
    rival_team_data  = teams_data.get(equipo_rival_id, teams_data.get(equipo_rival_id.capitalize(), {}))

    if mi_team_data:
        resultado_final = "Victoria" if mi_team_data.get("has_won", False) else "Derrota"
        marcador = {
            "mi_equipo": mi_team_data.get("rounds_won", 0),
            "rival":     mi_team_data.get("rounds_lost", 0),
        }

    # =========================================================
    # 5. PROCESAMIENTO DE RONDAS
    # =========================================================
    resumen_rondas = []
    dano_total_acumulado = 0   # para ADR preciso

    for ronda_num, r in enumerate(rondas):
        equipo_ganador = r.get("winning_team", "").lower()
        ganamos        = (equipo_ganador == mi_equipo_id)

        # Defaults
        bajas_en_ronda      = 0
        puntuacion_ronda    = 0
        dano_infligido      = 0
        eco_gasto           = 0
        eco_restante        = 0
        arma_nombre         = "Pistola / Compras"
        detalle_kills       = []

        stats_jugadores_ronda = r.get("player_stats", [])
        if isinstance(stats_jugadores_ronda, dict):
            stats_jugadores_ronda = list(stats_jugadores_ronda.values())

        for p_stats in stats_jugadores_ronda:
            p_puuid = p_stats.get("puuid", p_stats.get("player_puuid", ""))
            p_name  = p_stats.get("player_name", "").lower()

            if (mi_puuid and p_puuid == mi_puuid) or (p_name == mi_nombre_clean):
                bajas_en_ronda   = p_stats.get("kills", 0)
                puntuacion_ronda = p_stats.get("score", 0)
                dano_infligido   = p_stats.get("damage", 0)
                dano_total_acumulado += dano_infligido

                eco          = p_stats.get("economy", {}) or {}
                eco_gasto    = eco.get("spent", 0)
                eco_restante = eco.get("remaining", 0)
                arma_nombre  = resolver_arma(eco)

                # Detalle de kills en esta ronda
                kill_events  = p_stats.get("kill_events", p_stats.get("kills_events", []))
                detalle_kills = extraer_kills_ronda(kill_events, mi_puuid, mi_nombre_clean)
                break

        # Info de spike
        spike_info = extraer_spike_info(r)

        resumen_rondas.append({
            "ronda":              ronda_num + 1,
            "resultado":          "Victoria" if ganamos else "Derrota",
            "motivo_fin":         r.get("end_type", "Unknown"),
            "arma_utilizada":     arma_nombre,
            "creditos_gastados":  eco_gasto,
            "creditos_restantes": eco_restante,
            "dano_infligido":     dano_infligido,
            "bajas_conseguidas":  bajas_en_ronda,
            "score_ronda":        puntuacion_ronda,
            "detalle_kills":      detalle_kills,
            "spike":              spike_info,
        })

    # ADR preciso (suma real de daño por ronda / total rondas)
    if mis_stats_globales and total_rondas > 0:
        mis_stats_globales["ADR"] = round(dano_total_acumulado / total_rondas, 2)

    # =========================================================
    # 6. ESTADÍSTICAS CALCULADAS PARA EL AGENTE
    # =========================================================
    victorias = sum(1 for r in resumen_rondas if r["resultado"] == "Victoria")
    derrotas  = total_rondas - victorias

    # Rondas donde plantó o desactivó
    rondas_con_planta    = [r for r in resumen_rondas if r["spike"]["spike_plantada"]]
    rondas_con_defuse    = [r for r in resumen_rondas if r["spike"]["spike_desactivada"]]
    rondas_sin_bajas     = [r for r in resumen_rondas if r["bajas_conseguidas"] == 0]
    rondas_multikill     = [r for r in resumen_rondas if r["bajas_conseguidas"] >= 2]

    # Sitios de planta más frecuentes
    sitios = [r["spike"]["sitio_plantada"] for r in rondas_con_planta if r["spike"]["sitio_plantada"]]
    conteo_sitios = {}
    for s in sitios:
        conteo_sitios[s] = conteo_sitios.get(s, 0) + 1

    # Arma más usada
    armas_usadas = [r["arma_utilizada"] for r in resumen_rondas]
    conteo_armas = {}
    for a in armas_usadas:
        conteo_armas[a] = conteo_armas.get(a, 0) + 1
    arma_favorita = max(conteo_armas, key=conteo_armas.get) if conteo_armas else "Desconocida"

    estadisticas_calculadas = {
        "rondas_ganadas":          victorias,
        "rondas_perdidas":         derrotas,
        "arma_mas_usada":          arma_favorita,
        "rondas_sin_bajas":        len(rondas_sin_bajas),
        "rondas_multikill_2_mas":  len(rondas_multikill),
        "veces_que_se_planto_spike": len(rondas_con_planta),
        "veces_que_se_defuso_spike": len(rondas_con_defuse),
        "sitios_de_planta":        conteo_sitios,
        "frecuencia_armas":        conteo_armas,
    }

    # =========================================================
    # 7. JSON FINAL
    # =========================================================
    return {
        "contexto_partida": {
            "mapa":             mapa,
            "modo":             modo,
            "duracion_minutos": duracion_min,
            "total_rondas":     total_rondas,
            "resultado_final":  resultado_final,
            "marcador":         marcador,
            "fecha_analisis":   datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        "tu_rendimiento_general":  mis_stats_globales,
        "estadisticas_calculadas": estadisticas_calculadas,
        "historial_por_ronda":     resumen_rondas,
        "nota_limitacion_api": (
            "uso_habilidades_total_partida refleja el total acumulado de la partida completa. "
            "La API de Henrik v2 no desglosa los usos de habilidades por ronda. "
            "El ADR se calcula sumando el daño real ronda a ronda para máxima precisión."
        ),
    }


# --- PERSISTENCIA HISTÓRICA CON FECHA ---

def guardar_en_workspace(json_limpio, mapa, opcion):
    # 1. Asegurar la importación de datetime y definir el timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    nombre_archivo = f"ia_analisis_{mapa.lower()}_{timestamp}.json"

    # 2. Definir y forzar la ruta hacia la carpeta 'workspace'
    ruta_outputs = os.path.join(os.getcwd(), "outputs")
    os.makedirs(ruta_outputs, exist_ok=True)

    ruta_salida = os.path.join(ruta_outputs, nombre_archivo)

    # 3. Guardar el archivo directamente en el workspace de OpenClaw
    with open(ruta_salida, "w", encoding="utf-8") as f:
        json.dump(json_limpio, f, indent=4, ensure_ascii=False)

    # 4. Retornar el estado estructurado con el nombre limpio del archivo
    print(
        json.dumps(
            {
                "status": "success",
                "account": opcion,
                "file": nombre_archivo,  # Le pasamos solo el nombre para que se lo pidas fácil al bot en Discord
            },
            ensure_ascii=False,
        )
    )


# --- FLUJO PRINCIPAL ---

if __name__ == "__main__":
    print("=========================================")
    print("     VALORANT AI COACH - EXTRACTOR       ")
    print("=========================================")
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--account",
        choices=["las", "na"],
        required=True
    )

    args = parser.parse_args()

    opcion = args.account

    if opcion not in ["las", "na"]:
        print("❌ Opción inválida. Cerrando script.")
        sys.exit()

    cuenta_activa  = CUENTAS[opcion]
    nombre_completo = f"{cuenta_activa['name']}#{cuenta_activa['tag']}"

    print(f"\n🔍 Buscando partidas competitivas para: {nombre_completo}...")

    lista_partidas = obtener_historial_web(cuenta_activa)
    if not lista_partidas:
        print("❌ No se pudo obtener ningún dato. Verifica tu Riot ID público.")
        sys.exit()

    partida_competitiva = None
    match_id = None

    for match in lista_partidas:
        meta_info  = match.get("meta", {})
        tipo_cola  = meta_info.get("mode", match.get("queue", ""))
        if tipo_cola and tipo_cola.lower() == "competitive":
            partida_competitiva = match
            match_id = meta_info.get("id") or match.get("match_id")
            break

    if not partida_competitiva or not match_id:
        print("ℹ️ No se encontraron partidas competitivas recientes en tu historial.")
        sys.exit()

    registro_historico = cargar_registro_local()

    if registro_historico.get(nombre_completo) == match_id:
        print(f"🛑 La última partida competitiva (ID: {match_id}) ya fue procesada.")
        print("No se duplicarán datos.")
        sys.exit()

    print(f"✨ ¡Nueva partida encontrada! ID: {match_id}")
    print("Descargando métricas avanzadas...")

    detalles_crudos = obtener_detalles_partida_web(match_id)

    if detalles_crudos:
        json_limpio  = limpiar_json_henrik(detalles_crudos, cuenta_activa["name"])
        mapa_jugado  = json_limpio["contexto_partida"]["mapa"]
        resultado    = json_limpio["contexto_partida"]["resultado_final"]
        marcador     = json_limpio["contexto_partida"]["marcador"]

        print(f"🗺️  Mapa: {mapa_jugado} | {resultado} {marcador['mi_equipo']}-{marcador['rival']}")

        guardar_en_workspace(json_limpio, mapa_jugado)

        registro_historico[nombre_completo] = match_id
        guardar_registro_local(registro_historico)
        print("✅ Proceso terminado con éxito.")
    else:
        print("❌ Falló la descarga de detalles del match.")