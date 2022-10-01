import './App.css';
import React from 'react';
import alarm from './Bleep.mp3';

function App() {

  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timeOn, setTimeOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(new Audio(alarm));

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      };
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      };
      setSessionTime((prev) => prev + amount);
      if(!timeOn){
        setDisplayTime(sessionTime + amount);
      };
    };
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVar = onBreak;

    if(!timeOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if(date > nextDate) {
          setDisplayTime((prev) => {
            if(prev <= 0 && !onBreakVar){ 
              onBreakVar = true;
              setOnBreak(true);
              playBreakSound();

              return breakTime;
            } else if (prev <= 0 && onBreakVar){          
              onBreakVar = false;
              setOnBreak(false);
              playBreakSound();

              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    }
    if(timeOn){
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimeOn(!timeOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60)
    setBreakTime(5 * 60)
    setSessionTime(25 * 60)
  };

  return (
<div className="App center-align">
    <h1>25 + 5 Clock</h1>
    <div className='dual-container'>
      <Length 
      title={"Break length"}
      changeTime={changeTime}
      type={"break"}
      time={breakTime}
      formatTime={formatTime}
    />
      <Length 
      title={"Session length"}
      changeTime={changeTime}
      type={"session"}
      time={sessionTime}
      formatTime={formatTime}
    />
    </div>
    <h4>{onBreak ? "Break" : "Session"}</h4>
    <h2>{formatTime(displayTime)}</h2>
    <button onClick={controlTime} className='btn-large deep-purple lighten-2'>
      {timeOn ? (
        <i className='material-icons'>pause_circle_filled</i>
      ) : (
        <i className='material-icons'>play_circle_filled</i>
      )}
    </button>
    <button onClick={resetTime} className='btn-large deep-purple lighten-2'>
    <i className='material-icons'>autorenew</i> 
    </button>
</div>
  );
}



function Length({title, changeTime, type, time, formatTime}){

  return (
<div>
    <h4>{title}</h4>
    <div className='time-sets'>
      <button className='btn-small deep-purple lighten-2' onClick={() => changeTime(-60, type)}>
        <i className='material-icons'>arrow_downward</i>
      </button>
      <h4>{formatTime(time)}</h4>
      <button className='btn-small deep-purple lighten-2' onClick={() => changeTime(60, type)}>
        <i className='material-icons'>arrow_upward</i>
      </button>
    </div>
</div>
  );
}; 

export default App;
