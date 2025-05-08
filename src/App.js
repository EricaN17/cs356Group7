import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Experiment Manager</h1>
      <form>
        <label>
          Bit Depth:
          <select>
            <option>8</option>
            <option>10</option>
          </select>
        </label><br />
        <label>
          Spatial Resolution:
          <input type="text" placeholder="e.g. 1920x1080" />
        </label><br />
        <label>
          Temporal Resolution:
          <select>
            <option>Auto</option>
            <option>30fps</option>
            <option>60fps</option>
          </select>
        </label><br />
        <label>
          Duration:
          <select>
            <option>Auto</option>
            <option>Short</option>
            <option>Long</option>
          </select>
        </label><br />
        <label>
          Encoder Mode:
          <select>
            <option>Auto</option>
            <option>CBR</option>
            <option>VBR</option>
          </select>
        </label><br />
        <fieldset>
          <legend>Encoders</legend>
          <label><input type="checkbox" /> AVC</label>
          <label><input type="checkbox" /> HEVC</label>
          <label><input type="checkbox" /> SHVC</label>
          <label><input type="checkbox" /> VVC</label>
          <label><input type="checkbox" /> SVC</label>
        </fieldset><br />
        <button type="submit">Run Experiment</button>
      </form>
    </div>
  );
}

export default App;