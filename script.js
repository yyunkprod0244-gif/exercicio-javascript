document.addEventListener("DOMContentLoaded", () => {

    const canvas =
        document.getElementById("particlesCanvas");

    const ctx =
        canvas.getContext("2d");

    const card =
        document.getElementById("card");

    const pesoInput =
        document.getElementById("peso");

    const alturaInput =
        document.getElementById("altura");

    const calcularButton =
        document.getElementById("calcular");

    const resultado =
        document.getElementById("resultado");

    const classificacao =
        document.getElementById("classificacao");

    const feedback =
        document.getElementById("feedback");

    let width;
    let height;

    let mouseX = 0;
    let mouseY = 0;

    const particles = [];
    const particleCount = 90;

    /* =================================
       CANVAS DE PARTÍCULAS
    ================================= */

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        const ratio =
            window.devicePixelRatio || 1;

        canvas.width =
            width * ratio;

        canvas.height =
            height * ratio;

        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );
    }

    class Particle {
        constructor() {
            this.x =
                Math.random() * width;

            this.y =
                Math.random() * height;

            this.size =
                Math.random() * 2 + .4;

            this.speedX =
                (Math.random() - .5) * .35;

            this.speedY =
                (Math.random() - .5) * .35;

            this.alpha =
                Math.random() * .7 + .2;

            this.color =
                Math.random() > .5
                    ? "#ff4fd8"
                    : "#9d3cff";
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) {
                this.x = width;
            }

            if (this.x > width) {
                this.x = 0;
            }

            if (this.y < 0) {
                this.y = height;
            }

            if (this.y > height) {
                this.y = 0;
            }
        }

        draw() {
            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                this.color;

            ctx.globalAlpha =
                this.alpha;

            ctx.shadowBlur =
                12;

            ctx.shadowColor =
                this.color;

            ctx.fill();

            ctx.globalAlpha =
                1;

            ctx.shadowBlur =
                0;
        }
    }

    function createParticles() {
        particles.length = 0;

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {
            particles.push(
                new Particle()
            );
        }
    }

    function connectParticles() {
        for (
            let i = 0;
            i < particles.length;
            i++
        ) {
            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {
                const first =
                    particles[i];

                const second =
                    particles[j];

                const distanceX =
                    first.x - second.x;

                const distanceY =
                    first.y - second.y;

                const distance =
                    Math.sqrt(
                        distanceX * distanceX +
                        distanceY * distanceY
                    );

                if (distance < 130) {
                    const opacity =
                        .18 - distance / 900;

                    ctx.beginPath();

                    ctx.moveTo(
                        first.x,
                        first.y
                    );

                    ctx.lineTo(
                        second.x,
                        second.y
                    );

                    ctx.strokeStyle =
                        `rgba(255, 79, 216, ${opacity})`;

                    ctx.lineWidth =
                        .6;

                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseGlow() {
        const gradient =
            ctx.createRadialGradient(
                mouseX,
                mouseY,
                0,
                mouseX,
                mouseY,
                230
            );

        gradient.addColorStop(
            0,
            "rgba(255, 79, 216, .14)"
        );

        gradient.addColorStop(
            .5,
            "rgba(157, 60, 255, .06)"
        );

        gradient.addColorStop(
            1,
            "rgba(0, 0, 0, 0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }

    function animateParticles() {
        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        drawMouseGlow();

        particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        connectParticles();

        requestAnimationFrame(
            animateParticles
        );
    }

    window.addEventListener(
        "resize",
        () => {
            resizeCanvas();
            createParticles();
        }
    );

    document.addEventListener(
        "mousemove",
        (event) => {
            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            /* Rotação 3D do card */
            const rotateY =
                (event.clientX - width / 2) / 45;

            const rotateX =
                (height / 2 - event.clientY) / 45;

            card.style.transform = `
                rotateY(${rotateY}deg)
                rotateX(${rotateX}deg)
            `;
        }
    );

    document.addEventListener(
        "mouseleave",
        () => {
            card.style.transform =
                "rotateY(0deg) rotateX(0deg)";
        }
    );

    resizeCanvas();

    mouseX =
        width / 2;

    mouseY =
        height / 2;

    createParticles();
    animateParticles();


    /* =================================
       CALCULADORA DE IMC
    ================================= */

    function calcularIMC() {
        const peso =
            parseFloat(pesoInput.value);

        const altura =
            parseFloat(alturaInput.value);

        card.classList.remove(
            "normal",
            "attention",
            "danger",
            "error"
        );

        if (
            Number.isNaN(peso) ||
            Number.isNaN(altura) ||
            peso <= 0 ||
            altura <= 0
        ) {
            resultado.textContent =
                "Inválido";

            classificacao.textContent =
                "--";

            feedback.textContent =
                "Informe valores válidos para calcular.";

            card.classList.add(
                "error"
            );

            return;
        }

        const imc =
            peso / (altura * altura);

        let classificacaoTexto;
        let feedbackTexto;
        let estadoCard;

        if (imc < 18.5) {
            classificacaoTexto =
                "Abaixo do peso";

            feedbackTexto =
                "Seu resultado está abaixo da faixa considerada normal.";

            estadoCard =
                "attention";

        } else if (imc < 25) {
            classificacaoTexto =
                "Peso normal";

            feedbackTexto =
                "Seu resultado está dentro da faixa considerada normal.";

            estadoCard =
                "normal";

        } else if (imc < 30) {
            classificacaoTexto =
                "Sobrepeso";

            feedbackTexto =
                "Seu resultado indica uma faixa de atenção.";

            estadoCard =
                "attention";

        } else if (imc < 35) {
            classificacaoTexto =
                "Obesidade grau I";

            feedbackTexto =
                "Considere conversar com um profissional de saúde.";

            estadoCard =
                "danger";

        } else if (imc < 40) {
            classificacaoTexto =
                "Obesidade grau II";

            feedbackTexto =
                "Procure orientação profissional para uma avaliação completa.";

            estadoCard =
                "danger";

        } else {
            classificacaoTexto =
                "Obesidade grau III";

            feedbackTexto =
                "Procure acompanhamento profissional especializado.";

            estadoCard =
                "danger";
        }

        resultado.textContent =
            imc.toFixed(2);

        classificacao.textContent =
            classificacaoTexto;

        feedback.textContent =
            feedbackTexto;

        card.classList.add(
            estadoCard
        );
    }

    calcularButton.addEventListener(
        "click",
        calcularIMC
    );

    pesoInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                calcularIMC();
            }
        }
    );

    alturaInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Enter") {
                calcularIMC();
            }
        }
    );

});
