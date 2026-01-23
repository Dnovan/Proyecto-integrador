
import React from 'react';
import { motion } from 'framer-motion';
import BounceCards from '../../components/molecules/BounceCards';
import { Music, Utensils, Camera, Mic2, Palette } from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { useNavigate } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
    const navigate = useNavigate();

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

    const images = [
        "https://cdn0.bodas.com.mx/vendor/3785/3_2/1280/jpg/pinzon-22_5_43785-172468561594702.webp",
        "https://cdn0.bodas.com.mx/vendor/7305/original/1280/jpg/img-2829x_5_147305.webp",
        "https://cdn0.bodas.com.mx/vendor/1031/3_2/960/jpeg/3aecf5fc-c702-40e5-9c74-786f983f8664_5_251031-162604050917968.webp",
        "https://cdn0.bodas.com.mx/vendor/7063/3_2/960/png/belleza-acogedora_v8.webp",
        "https://verydiferente.com/wp-content/uploads/2021/10/Loleo.jpg",
        "https://partfy.s3.eu-south-2.amazonaws.com/frontend/files/packs/3157/unnamed-_7166.jpg",
        "https://thebestofdr.do/wp-content/uploads/2025/01/locales-para-eventos-rd-1000x630.jpg"
    ];

    const transformStyles = [
        "rotate(10deg) translate(-210px)",
        "rotate(5deg) translate(-140px)",
        "rotate(2deg) translate(-70px)",
        "rotate(0deg)",
        "rotate(-2deg) translate(70px)",
        "rotate(-5deg) translate(140px)",
        "rotate(-10deg) translate(210px)"
    ];

    return (
        <div className="min-h-screen bg-bg-primary pt-20">
            {/* Hero Section with BounceCards */}
            <section className="relative py-20 px-4 overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-neon/5 -z-10" />

                <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-neon to-white tracking-tighter">
                            Nuestros Servicios
                        </h1>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                            Descubre los mejores espacios y servicios para hacer de tu evento una experiencia inolvidable.
                        </p>
                    </motion.div>
                </div>

                <div className="relative w-full flex justify-center pb-20">
                    <BounceCards
                        className="custom-bounceCards scale-75 md:scale-100"
                        images={images}
                        containerWidth={500}
                        containerHeight={250}
                        animationDelay={1}
                        animationStagger={0.08}
                        easeType="elastic.out(1, 0.5)"
                        transformStyles={transformStyles}
                        enableHover={true}
                    />
                </div>
            </section>

            {/* Categorías de Servicios */}
            <section className="py-20 px-4 bg-bg-secondary">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Locales */}
                        <div className="col-span-1 md:col-span-3 mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4 border-l-4 border-neon pl-4">Espacios Exclusivos</h2>
                            <p className="text-text-secondary mb-8">Encuentra el lugar perfecto para tu celebración.</p>
                        </div>

                        {[
                            { title: 'Jardines', img: images[0], desc: 'Espacios al aire libre para bodas y eventos de día.' },
                            { title: 'Salones', img: images[1], desc: 'Elegancia y confort para eventos nocturnos.' },
                            { title: 'Haciendas', img: images[2], desc: 'Arquitectura histórica y encanto tradicional.' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                                onClick={() => navigate('/buscar')}
                            >
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-300 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Servicios Adicionales & Entretenimiento */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                        {/* Servicios */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <Utensils className="text-neon" /> Servicios Esenciales
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <Utensils />, title: 'Banquetes', desc: 'Menús gourmet adaptados a tus preferencias.' },
                                    { icon: <Camera />, title: 'Fotografía y Video', desc: 'Captura cada momento especial.' },
                                    { icon: <Palette />, title: 'Decoración', desc: 'Transformamos espacios en sueños.' }
                                ].map((service, idx) => (
                                    <motion.div key={idx} variants={fadeInUp} className="flex gap-4 p-4 rounded-xl bg-bg-card border border-white/5 hover:border-neon/30 transition-colors">
                                        <div className="w-12 h-12 rounded-lg bg-neon/10 flex items-center justify-center text-neon flex-shrink-0">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white">{service.title}</h4>
                                            <p className="text-text-secondary text-sm">{service.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Entretenimiento */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                <Music className="text-neon" /> Show y Entretenimiento
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: <Music />, title: 'DJs en Vivo' },
                                    { icon: <Mic2 />, title: 'Bandas' },
                                    { icon: <Palette />, title: 'Performances' },
                                    { icon: <Camera />, title: 'Cabina 360' }
                                ].map((item, idx) => (
                                    <motion.div key={idx} variants={fadeInUp} className="aspect-square rounded-2xl bg-bg-card border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-neon group-hover:text-black transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="font-medium text-white">{item.title}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-neon/20 to-purple-500/20 border border-white/10 backdrop-blur-md">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para planear tu evento?</h2>
                    <p className="text-text-secondary mb-8 text-lg">Encuentra todo lo que necesitas en un solo lugar.</p>
                    <Button size="lg" onClick={() => navigate('/buscar')}>
                        Explorar Catálogo Completo
                    </Button>
                </div>
            </section>
        </div>
    );
};
