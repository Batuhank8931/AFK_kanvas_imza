import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import './App.css';

function App() {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault();
    };
    
    const stage = stageRef.current;
    if (stage) {
      stage.content.addEventListener('touchstart', preventDefault, { passive: false });
      stage.content.addEventListener('touchmove', preventDefault, { passive: false });
      stage.content.addEventListener('touchend', preventDefault, { passive: false });
    }

    return () => {
      if (stage) {
        stage.content.removeEventListener('touchstart', preventDefault);
        stage.content.removeEventListener('touchmove', preventDefault);
        stage.content.removeEventListener('touchend', preventDefault);
      }
    };
  }, []);

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const { x, y } = event.target.getStage().getPointerPosition();
    setLines([...lines, { points: [x, y] }]);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;
    const stage = event.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Replace the last line with the new one
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const saveImage = (format) => {
    const dataURL = stageRef.current.toDataURL({ mimeType: `image/${format}` });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `drawing.${format}`;
    link.click();
  };

  return (
    <div className="App">
      <h1>React Canvas Drawing</h1>
      <Stage
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.8}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
      <div className="buttons">
        <button onClick={() => saveImage('png')}>Save as PNG</button>
        <button onClick={() => saveImage('jpeg')}>Save as JPEG</button>
      </div>
    </div>
  );
}

export default App;
