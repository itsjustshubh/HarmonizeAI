import { motion } from 'framer-motion';
import ThemeSwitch from "./components/ThemeSwitch";
import React from "react";

const pageVariants = {
    initial: {
        opacity: 0,
        x: '-100vw',
    },
    in: {
        opacity: 1,
        x: 0,
    },
    out: {
        opacity: 0,
        x: '100vw',
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

export const PageTransitionWrapper = ({ children }) => {
    return (
        <div>
            <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </div>
    );
};
