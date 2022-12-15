import "./App.css";
import React from "react";
import alarm from "./Bleep.mp3";

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timeOn, setTimeOn] = React.useState(false);
  const [isOnBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(new Audio(alarm));

  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        setSessionTime(1500);
        return;
      }

      setSessionTime((prev) => prev + amount);
      if (!timeOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  let isOnBreakLocal = false;
  const controlTime = () => {
    let oneSecond = 1000;
    let currentTimeInSeconds = new Date().getTime();
    let nextDate = new Date().getTime() + oneSecond;
    let prevDisplayTime = displayTime;

    if (!timeOn) {
      let interval = setInterval(() => {
        if (prevDisplayTime <= 0 && !isOnBreakLocal) {
          setOnBreak(true);
          isOnBreakLocal = true;
          playBreakSound();
          setDisplayTime(breakTime);
          prevDisplayTime = breakTime;
        } else if (prevDisplayTime <= 0 && isOnBreakLocal) {
          setOnBreak(false);
          isOnBreakLocal = false;
          playBreakSound();
          setDisplayTime(sessionTime);
          prevDisplayTime = sessionTime;
        } else {
          setDisplayTime(--prevDisplayTime);
        }
      }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timeOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimeOn(!timeOn);
  };

  const resetTime = (time) => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div className="App center-align">
      <div>
        <h3>25 + 5 Clock</h3>
        <i className="medium material-icons sha">access_time</i>
      </div>
      <div className="dual-container row">
        <Length
          id={"break-label"}
          title={"Break length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
          btnIdDown={"break-decrement"}
          btnIdUp={"break-increment"}
          formatId={"break-length"}
        />
        <Length
          id={"session-label"}
          title={"Session length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
          btnIdDown={"session-decrement"}
          btnIdUp={"session-increment"}
          formatId={"session-length"}
        />
      </div>
      <h4 id="timer-label">{isOnBreak ? "Break" : "Session"}</h4>
      <h2 
        className="black"
        id="time-left"
        style={{
          color: displayTime <= 59 ? "#ad1457" : null,
        }}
      >
        {formatTime(displayTime)}
      </h2>
      <button
        id="start_stop"
        onClick={controlTime}
        className="btn-large pink darken-3 sha"
      >
        {timeOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button
        id="reset"
        onClick={resetTime}
        className="btn-large pink darken-3 sha"
      >
        <i className="material-icons">autorenew</i>
      </button>
      <div className="col s12 footer">
        © &nbsp;
        <span>{new Date().getFullYear()}</span>
        &nbsp; Riccardo Limiti
      </div>
    </div>
  );
}

function Length({
  title,
  changeTime,
  type,
  time,
  formatTime,
  id,
  btnIdDown,
  btnIdUp,
  formatId,
}) {
  return (
    <div className="component-container">
      <h4 id={id}>{title}</h4>
      <div className="time-sets">
        <button
          id={btnIdDown}
          className="btn-small pink darken-3 sha"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h4 id={formatId}>{time / 60} min.</h4>
        <button
          id={btnIdUp}
          className="btn-small pink darken-3 sha"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

export default App;
