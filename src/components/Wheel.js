import React, { useRef } from 'react';
import { useEffect } from 'react';

export const Wheel = props => {
   const { slices, optionlist } = props
   const canvasRef = useRef(null);
   const colors = ['#EFBCD5',
                  '#3185FC',
                  '#F9DC5C',
                  '#E84855',
                  '#393843'
                  ];
   
   const friction = 0.995;
   const random = () => Math.random() * (0.45 - 0.25) + 0.25;
   let angSpd = 0;
   let ang = 0;

   const draw = (ctx, n=1) => {
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;
      const rad = ctx.canvas.width / 2 - 5;
      const slice = n === 0? Math.PI * 2:  Math.PI * 2/ n;
      for (let i = 0; i < n; i++) {
         ctx.save();
         //drawing each sector
         ctx.beginPath();
         ctx.fillStyle = n ? colors[i % 6]: 'white';
         ctx.moveTo(centerX,centerY);
         ctx.arc(centerX, centerY, rad, slice*i, slice + slice*i);
         ctx.lineTo(centerX,centerY);
         ctx.fill();
         // option name
         ctx.translate(centerX, centerY);
         ctx.rotate(slice*i + slice / 2);
         ctx.textAlign = "right";
         ctx.fillStyle = "#fff";
         ctx.font = optionlist[i].name.length > 10 ? 
                  "bold 20px sans-serif"
                  :"bold 26px sans-serif";
         ctx.fillText(optionlist[i] ? optionlist[i].name: "", rad - 10, 10);
         ctx.restore(); 
      }
   
   }   

   function spin() {
      const EL_wheel = document.querySelector("#wheelCanvas")
      EL_wheel.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
   }
   function frame() {
      if (!angSpd) return;
      angSpd *= friction; // Decrement velocity by friction
      if (angSpd < 0.002) {
         angSpd = 0;
         const optionButton = document.querySelectorAll('.option-btn');
         optionButton.forEach(button => {
            button.removeAttribute("disabled");
         });
      }; // Bring to stop
      ang += angSpd; // Update angle
      ang %= (2 * Math.PI); // Normalize angle
      spin();
   }

   function engine() {
      frame();
      requestAnimationFrame(engine)
   }

   function handleSpinClick() {
      if (!angSpd) {
         angSpd = random();
         const optionButton = document.querySelectorAll('.option-btn');
         optionButton.forEach(button => {
            button.setAttribute("disabled", "true");
         });

      }
   }

   useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // drawing circle
      draw(ctx, slices ? slices : 1)
      engine();
   }, [draw])


   return (<>
            <div className='selection'></div>
            <canvas id='wheelCanvas' ref={canvasRef} {...props}/>
            <div className='btn-container'>
               <button className="btn btn-gradient btn-rounded" type="button" onClick={handleSpinClick}> Spin </button>
            </div>
            
         </>)
}

export default Wheel;