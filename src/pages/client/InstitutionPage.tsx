
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { useNavigate } from 'react-router-dom';
import InfiniteMenu from '../../components/molecules/InfiniteMenu';

export const InstitutionPage: React.FC = () => {
    const navigate = useNavigate();

    const items = [
        {
            image: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Eventos Exclusivos',
            description: 'Espacios únicos para momentos memorables.'
        },
        {
            image: 'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Ambiente Perfecto',
            description: 'La atmósfera ideal para tu celebración.'
        },
        {
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Jardines Mágicos',
            description: 'Naturaleza y elegancia en un solo lugar.'
        },
        {
            image: 'https://images.unsplash.com/photo-1616423661138-0245a1e7d095?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Salones de Lujo',
            description: 'Sofisticación en cada detalle.'
        }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <InfiniteMenu items={items} />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-7xl mx-auto text-center px-4 pointer-events-none">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon to-white tracking-tighter drop-shadow-2xl">
                            EventSpace
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
                            Renta. Reserva. Celebra.
                        </h2>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 drop-shadow-md font-medium">
                            ¿Planeando un evento y no sabes por dónde empezar?
                            <br />
                            Con EventSpace olvídate de la búsqueda interminable, las llamadas y la mala coordinación. Aquí encuentras el local perfecto, comida, y meseros incluidos, todo desde una sola app.
                        </p>
                    </motion.div>
                </div>

                {/* Overlay Gradient to fade into next section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-bg-secondary">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <h3 className="text-3xl font-bold text-white mb-6">
                            Todo lo que tu evento necesita, ahora mismo
                        </h3>
                        <p className="text-text-secondary mb-8">
                            En EventSpace conectamos personas con espacios listos para eventos y servicios profesionales que hacen que todo fluya. Tú eliges el lugar, nosotros nos encargamos del resto.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Locales disponibles y verificados",
                                "Reservas rápidas y seguras",
                                "Servicios de comida para tu evento",
                                "Meseros profesionales incluidos",
                                "Control total desde tu celular"
                            ].map((item, index) => (
                                <motion.div key={index} variants={fadeInUp} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center text-neon">
                                        <Check size={14} />
                                    </div>
                                    <span className="text-text-primary">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-bg-card p-8 rounded-3xl border border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h4 className="text-2xl font-bold text-white mb-4">Sin estrés. Sin complicaciones. Sin pérdidas de tiempo.</h4>
                        <p className="text-text-secondary mb-6">Elige mejor. Reserva más rápido.</p>
                        <Button fullWidth onClick={() => navigate('/buscar')}>
                            Explorar Espacios
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h3 className="text-3xl font-bold text-white mb-6">
                            ¿Por qué complicarte coordinando proveedores?
                        </h3>
                        <p className="text-text-secondary text-lg leading-relaxed mb-12">
                            Con EventSpace tienes todo centralizado para que tu evento salga perfecto desde el primer clic. Ya sea una fiesta, un evento corporativo o una celebración especial, aquí encuentras la solución completa.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Providers Section */}
            <section className="py-20 px-4 bg-bg-secondary relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 md:order-1"
                    >
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-bg-card to-bg-primary border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-4">También para dueños de locales</h3>
                            <p className="text-text-secondary mb-6">
                                ¿Tienes un espacio disponible? Publícalo en EventSpace y comienza a generar ingresos. Aumenta tu visibilidad, recibe reservas reales y administra todo desde un solo lugar.
                            </p>
                            <Button variant="outline" onClick={() => navigate('/registro?role=PROVEEDOR')}>
                                Publicar mi espacio
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="order-1 md:order-2"
                    >
                        <h3 className="text-3xl font-bold text-white mb-6">
                            Convierte tu evento en una experiencia inolvidable
                        </h3>
                        <p className="text-text-secondary mb-6">
                            En EventSpace creemos que organizar un evento debe ser fácil, rápido y confiable. Por eso creamos una plataforma que te da control, confianza y resultados.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-neon/10" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Rocket className="w-8 h-8 text-neon" />
                            <h2 className="text-4xl font-bold text-white">Reserva hoy. Celebra mañana.</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left bg-bg-card/50 p-8 rounded-2xl backdrop-blur-sm border border-white/5">
                            <div className="flex gap-3">
                                <ArrowRight className="w-5 h-5 text-neon flex-shrink-0 mt-1" />
                                <p className="text-text-secondary">Reserva ahora y asegura el espacio ideal para tu evento.</p>
                            </div>
                            <div className="flex gap-3">
                                <ArrowRight className="w-5 h-5 text-neon flex-shrink-0 mt-1" />
                                <p className="text-text-secondary">Explora locales disponibles en tu ciudad.</p>
                            </div>
                            <div className="flex gap-3">
                                <ArrowRight className="w-5 h-5 text-neon flex-shrink-0 mt-1" />
                                <p className="text-text-secondary">Agenda comida y meseros en un solo paso.</p>
                            </div>
                        </div>

                        <div className="mb-12">
                            <Button size="lg" onClick={() => navigate('/buscar')}>
                                Comenzar Ahora
                            </Button>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">EventSpace</h3>
                        <p className="text-text-secondary">Donde los eventos dejan de ser un problema y se convierten en momentos inolvidables.</p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
