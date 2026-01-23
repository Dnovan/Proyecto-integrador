
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Users } from 'lucide-react';
import CardSwap, { Card } from '../../components/molecules/CardSwap';

export const ContactPage: React.FC = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const founders = [
        "Uziel Alfonso García Ríos",
        "Andrés Ernesto Ciau Chan",
        "Donovan Yael De Icaza Cruz",
        "Marco Antonio Castellanos Solís"
    ];

    const venueImages = [
        "https://cdn0.bodas.com.mx/vendor/3785/3_2/1280/jpg/pinzon-22_5_43785-172468561594702.webp",
        "https://cdn0.bodas.com.mx/vendor/7305/original/1280/jpg/img-2829x_5_147305.webp",
        "https://cdn0.bodas.com.mx/vendor/1031/3_2/960/jpeg/3aecf5fc-c702-40e5-9c74-786f983f8664_5_251031-162604050917968.webp",
        "https://thebestofdr.do/wp-content/uploads/2025/01/locales-para-eventos-rd-1000x630.jpg"
    ];

    return (
        <div className="min-h-screen bg-bg-primary pt-20">
            {/* Hero & Content */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon to-white">
                            Sobre Nosotros
                        </h1>

                        <div className="bg-bg-card p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-sm mb-12">
                            <p className="text-lg text-text-secondary leading-relaxed mb-12">
                                LocalSpace es una aplicación creada y administrada por su equipo fundador, enfocado en ofrecer una plataforma confiable, práctica y moderna para la renta de locales y la organización de eventos.
                            </p>

                            {/* CardSwap Animation with Venue Images */}
                            <div className="mb-16 relative h-[350px] md:h-[400px] w-full flex justify-center items-center">
                                <CardSwap
                                    width={400}
                                    height={250}
                                    cardDistance={50}
                                    verticalDistance={30}
                                    delay={3500}
                                    pauseOnHover={true}
                                >
                                    {venueImages.map((src, index) => (
                                        <Card key={index} className="overflow-hidden border-4 border-white">
                                            <img src={src} alt={`Venue ${index + 1}`} className="w-full h-full object-cover" />
                                        </Card>
                                    ))}
                                </CardSwap>
                            </div>

                            {/* Founders List */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center gap-3">
                                    <Users className="text-neon" />
                                    El proyecto está liderado por:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {founders.map((name, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon/50 transition-colors"
                                        >
                                            <p className="text-lg text-white font-medium">{name}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <p className="text-text-secondary leading-relaxed mb-8">
                                Como fundadores de LocalSpace, participamos activamente en el desarrollo, operación y crecimiento de la plataforma, con el compromiso de mejorar constantemente la experiencia de nuestros usuarios y aliados.
                            </p>

                            <p className="text-text-secondary leading-relaxed font-medium">
                                Si tienes dudas, comentarios o estás interesado en colaborar con nosotros, no dudes en ponerte en contacto. En LocalSpace creemos en las alianzas, la innovación y en crear eventos mejor organizados.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-bg-secondary p-8 rounded-2xl border border-white/5 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center text-neon">
                                <Mail />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Email</h4>
                                <p className="text-text-secondary">contacto@LocalSpace.com</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-bg-secondary p-8 rounded-2xl border border-white/5 flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-neon/10 rounded-full flex items-center justify-center text-neon">
                                <Phone />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Teléfono</h4>
                                <p className="text-text-secondary">+52 55 1234 5678</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="rounded-3xl overflow-hidden border border-white/10 h-[400px] w-full"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.138477123985!2d-89.60533346939088!3d20.97120300067645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5673e4407519ff%3A0x6291619623631f6!2zSG90ZWwgUGxhemEgTWlyYWRvciBNw6lyaWRh!5e0!3m2!1ses-419!2smx!4v1736895318536!5m2!1ses-419!2smx"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
