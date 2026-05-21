/*


import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Code2,
  Rocket,
  Users,
  TrendingUp,
  Shield,
  Zap,
  GitBranch,
  DollarSign,
  Cloud,
  Lock,
  BarChart3,
  Box,
  ChevronRight,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Soluciones Reutilizadas', value: '15.2K', icon: Box },
    { label: 'Ingresos Generados', value: '$4.8M', icon: DollarSign },
    { label: 'Empresas Activas', value: '2,340', icon: Users },
    { label: 'Módulos Compartidos', value: '8,920', icon: GitBranch }
  ];

  const features = [
    {
      icon: Code2,
      title: 'Desarrollo Modular',
      description: 'Software empresarial construido como bloques reutilizables',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: GitBranch,
      title: 'Ecosistema de Forks',
      description: 'Evoluciona y adapta soluciones existentes con versionado inteligente',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: DollarSign,
      title: 'Economía de Regalías',
      description: 'Monetiza cada reutilización con pagos automáticos en cascada',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Cloud,
      title: 'Runtime Cloud',
      description: 'Ejecuta y escala aplicaciones con infraestructura managed',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Seguridad Automatizada',
      description: 'Escaneo continuo, validación de integridad y compliance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'ROI Empresarial',
      description: 'Métricas en tiempo real de ahorro, productividad y eficiencia',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Publicar Problema',
      description: 'Empresas definen desafíos operativos con requisitos técnicos y presupuesto',
      icon: Rocket
    },
    {
      step: '02',
      title: 'Desarrollar Solución',
      description: 'Desarrolladores crean software modular, reutilizable y escalable',
      icon: Code2
    },
    {
      step: '03',
      title: 'Marketplace Inteligente',
      description: 'Soluciones se convierten en activos comercializables en el ecosistema',
      icon: Box
    },
    {
      step: '04',
      title: 'Reutilización & Regalías',
      description: 'Cada fork genera ingresos pasivos para los desarrolladores originales',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation }
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">DevSolve</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link to="/ecosystem" className="text-muted-foreground hover:text-foreground transition-colors">
              Ecosistema
            </Link>
            <Link to="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentación
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section }
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Marketplace Inteligente de Microsoftware Empresarial</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Convierte software empresarial en activos reutilizables
            </h1>

            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Las empresas publican problemas. Los desarrolladores construyen soluciones.<br />
              El ecosistema reutiliza, monetiza y evoluciona el software.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                Explorar Marketplace
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/challenges/publish"
                className="px-8 py-4 bg-card hover:bg-muted border border-border text-foreground rounded-lg font-medium transition-all hover:scale-105"
              >
                Publicar Problema
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent hover:bg-card border border-border text-foreground rounded-lg font-medium transition-all"
              >
                Convertirme en Desarrollador
              </Link>
            </div>
          </motion.div>

          {/* Stats }
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 hover:bg-card transition-colors"
              >
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works }
      <section className="py-20 px-6 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cómo Funciona el Ecosistema</h2>
            <p className="text-xl text-muted-foreground">
              De problema a solución a activo reutilizable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <item.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid }
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Plataforma de Nueva Generación</h2>
            <p className="text-xl text-muted-foreground">
              Tecnología avanzada para el desarrollo de software reutilizable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section }
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Únete al futuro del desarrollo de software
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Empresas, desarrolladores y el ecosistema trabajando juntos para crear software mejor y más eficiente
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Comenzar Ahora
            </Link>
            <a
              href="#"
              className="px-10 py-4 bg-transparent border border-border hover:bg-card text-foreground rounded-lg font-medium transition-all"
            >
              Ver Documentación
            </a>
          </div>
        </div>
      </section>

      {/* Footer }
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><Link to="/runtime" className="hover:text-foreground transition-colors">Runtime Cloud</Link></li>
                <li><Link to="/security" className="hover:text-foreground transition-colors">Seguridad</Link></li>
                <li><Link to="/subscriptions" className="hover:text-foreground transition-colors">Precios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Desarrolladores</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">SDK</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Comunidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Licencias</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">DevSolve</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DevSolve. Marketplace inteligente de microsoftware empresarial.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
*/ 






