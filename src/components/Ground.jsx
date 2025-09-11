import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { createPortal } from "react-dom";


const Ground = ({ target }) => {
    const harryRef = useRef()
    const snitchRef = useRef()
    const intervalRef = useRef()
    const [text, setText] = useState("")
    const caughtRef = useRef(false)
    const [harryPos, setHarryPos] = useState({ top: 0, left: 0 })
const [snitchPos, setSnitchPos] = useState({ top: 0, left: 0 })

    const getRandomDots = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        return {
            randomWidth: Math.floor(Math.random() * width),
            randomHeight: Math.floor(Math.random() * height),
        }
    }

    const isColliding = (a, b) => {
        if (!a || !b) return false

        const harry = a.getBoundingClientRect()
        const snitch = b.getBoundingClientRect()

        return !(
            harry.top > snitch.bottom ||
            harry.bottom < snitch.top ||
            harry.left > snitch.right ||
            harry.right < snitch.left
        )
    }

    useEffect(() => {
        
        setHarryPos(getRandomDots())
    setSnitchPos(getRandomDots())
        const handleMouse = (e) => {
            if (caughtRef.current) return
            if (harryRef.current) {
                gsap.to(harryRef.current, {
                    left: e.clientX - 75, // center Harry
                    top: e.clientY - 75,
                    duration: 0.05,
                    onUpdate: () => {
                        if (isColliding(harryRef.current, snitchRef.current)) {
                            gsap.globalTimeline.clear()
                            gsap.killTweensOf([harryRef.current, snitchRef.current])
                            if (intervalRef.current) clearInterval(intervalRef.current)
                            caughtRef.current = true
                            if (target.current) {
                                gsap.to(target.current, {
                                    duration: 1,
                                    filter: "blur(10px)",
                                    ease: "power1.out"
                                })
                            }

                            setText("You caught the Snitch!")
                            confetti(({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#FFD700', '#FF0000', '#4B0082', '#00FF00'], // golden + fun colors

                            }))

                        }
                    }
                })
            }
        }

        intervalRef.current = setInterval(() => {
            if (snitchRef.current) {
                const { randomWidth, randomHeight } = getRandomDots()
                gsap.to(snitchRef.current, {
                    left: randomWidth,
                    top: randomHeight,
                    duration: 2,
                })
            }
        }, 400)



        window.addEventListener("mousemove", handleMouse)

        return () => {
            window.removeEventListener("mousemove", handleMouse)
            clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <div className="w-full h-full relative">
            <img
                ref={harryRef}
                src="/images/harry.png"
                alt="Harry in broom"
                width={150}
                className="absolute transform scale-x-[-1] top-0 left-0"
                    style={{ top: harryPos.randomHeight, left: harryPos.randomWidth }}

            />
            <img
                ref={snitchRef}
                src="/images/Golden_Snitch.webp"
                alt="golden snitch"
                width={50}
                className="absolute top-0 left-0"
                    style={{ top: snitchPos.randomHeight, left: snitchPos.randomWidth }}

            />
            {caughtRef.current &&
                createPortal(
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg animate-bounce">
                            You caught the Snitch!
                        </h1>
                    </div>,
                    document.body // renders at the very root, outside any blurred container
                )
            }

        </div>
    )
}

export default Ground
