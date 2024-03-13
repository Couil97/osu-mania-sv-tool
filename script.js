function copy(text) {
  var input = document.createElement('textarea');
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}
function sliderSize(min, max, prefix) {

  let multip = ((document.getElementById(prefix + 'current_bpm').value / document.getElementById(prefix + 'song_bpm').value) * document.getElementById(prefix + 'multi').value)

  let x = 10 / (max * multip)
  let y = 0.01 * (min / multip)
  if (x > 1) x = 1;
  if (y < 1) y = 1;

  if (multip > 1) {
    document.getElementById(prefix + 'limit').max = max * x
    document.getElementById(prefix + 'limit').min = min
  }
  if (multip < 1) {
    document.getElementById(prefix + 'limit').min = min * x
    document.getElementById(prefix + 'limit').max = max
  }

}
function interpString(text) {

  text = text.replace(/\D/g, '');
  for (let i = 0; i < text.length; i++)
    if (text[0] == '0') text = text.substring(1);

  return text;

}
function parseTime(time) {

  //not acounting for maps over 1 hour for now.

  if (time > 100000) {

    let min = Math.floor(time / 100000)
    console.log(min)
    time = (min * 60000) + (time - (min * 100000))
    console.log(time)

  }

  return time

}


function calculateTP() {

  let SVL = 0;
  let sv_string = '';

  let song_bpm = document.getElementById('tp_song_bpm').value;
  let current_bpm = document.getElementById('tp_current_bpm').value
  let multip = parseInt(song_bpm) / parseInt(current_bpm) * document.getElementById('tp_multi').value

  let start = parseTime(parseInt(interpString(document.getElementById('tp_start').value)))
  let end = parseTime(parseInt(interpString(document.getElementById('tp_end').value)))

  let time = end - start

  let temp_time = time * multip;

  let min = document.getElementById('tp_sv_min_range').value
  let max = document.getElementById('tp_sv_max_range').value

  for (let i = 0; i < 10; i++) {

    if (Math.ceil(SVL) == Math.ceil((temp_time - (time * min)) / max)) break;

    SVL = (temp_time - (time * min)) / max
    time = (temp_time / multip) - Math.ceil(SVL);

  }

  if (document.getElementById('tp_reverse').checked) {

    sv_string = start + ',' + (-100 / min) + ',1,1,0,100,0,0\n'
    if (SVL % 1 > 0) sv_string += (parseInt(end) - Math.ceil(SVL)) + ',' + (-100 / (SVL % 1 * max)) + ',1,1,0,100,0,0\n'
    sv_string += (parseInt(end) - Math.floor(SVL)) + ',' + (-100 / max) + ',1,1,0,100,0,0'

  }
  else {

    sv_string = start + ',' + (-100 / max) + ',1,1,0,100,0,0\n'
    if (SVL % 1 > 0) sv_string += (parseInt(start) + Math.floor(SVL)) + ',' + (-100 / (SVL % 1 * max)) + ',1,1,0,100,0,0\n'
    sv_string += (parseInt(start) + Math.ceil(SVL)) + ',' + (-100 / min) + ',1,1,0,100,0,0'

    console.log(((max * Math.floor(SVL)) + ((SVL % 1) * max) + (((temp_time / multip) - Math.ceil(SVL)) * min)) / (temp_time / multip))

  }

  copy(sv_string)

}
function calculateEXP() {


  let int_value = 0, sum = 0, t = new Array(15);
  let sv_string = '';

  let song_bpm = document.getElementById('exp_song_bpm').value;
  let current_bpm = document.getElementById('exp_current_bpm').value
  let multip = parseInt(song_bpm) / parseInt(current_bpm) * document.getElementById('exp_multi').value

  let start = parseTime(parseInt(interpString(document.getElementById('exp_start').value)))
  let end = parseTime(parseInt(interpString(document.getElementById('exp_end').value)))
  let time = end - start

  let limit = document.getElementById('exp_limit').value

  let d = 0.001;

  while (1) {

    int_value = Math.log(limit)
    sum = 0;

    for (let i = 0; i < 16; i++) {

      t[i] = Math.exp(int_value)
      int_value = int_value + d
      sum = sum + t[i]

    }

    if ((sum / 16) > (multip + (0.03 * multip))) d = d - 0.001
    else if ((sum / 16) < (multip - (0.03 * multip))) d = d + 0.001
    else break;

  }

  int_value = time / 16;

  if (document.getElementById('exp_reverse').checked) t = t.reverse()

  for (let i = 0; i <= 16; i++)
    if (i == 16) sv_string += (parseInt(start) + (int_value * i)) + ',' + '-100,4,1,0,100,0,0\n'
    else sv_string += (parseInt(start) + (int_value * i)) + ',' + (-100 / t[i]) + ',4,1,0,100,0,0\n'

  copy(sv_string)

}
function calculateLIN() {

  let t = new Array(15)
  let sv_string = '';

  let sum = 0;

  let song_bpm = document.getElementById('lin_song_bpm').value;
  let current_bpm = document.getElementById('lin_current_bpm').value
  let multip = parseInt(song_bpm) / parseInt(current_bpm) * document.getElementById('lin_multi').value

  let start = parseTime(parseInt(interpString(document.getElementById('lin_start').value)))
  let end = parseTime(parseInt(interpString(document.getElementById('lin_end').value)))
  let time = end - start

  let limit = parseFloat(document.getElementById('lin_limit').value) * multip

  t[0] = limit
  t[15] = (multip - limit) + multip
  let d = (t[15] - t[0]) / 15

  for (let i = 1; i < 15; i++) {

    t[i] = limit + (d * i)

  }

  for (let i = 0; i < 16; i++) {
    sum = sum + t[i]
  }

  console.log(sum / 16)

  if (document.getElementById('lin_reverse').checked) t = t.reverse()

  for (let i = 0; i < 16; i++)
    sv_string += (parseInt(start) + ((time / 16) * i)) + ',' + (-100 / t[i]) + ',1,1,0,100,0,0\n'

  copy(sv_string)

}
function calculateSTU() {

  let SVL = 0;
  let sv_string = '';

  let song_bpm = document.getElementById('stu_song_bpm').value;
  let current_bpm = document.getElementById('stu_current_bpm').value
  let multip = parseInt(song_bpm) / parseInt(current_bpm) * document.getElementById('stu_multi').value

  let start = parseTime(parseInt(interpString(document.getElementById('stu_start').value)))
  let end = parseTime(parseInt(interpString(document.getElementById('stu_end').value)))

  let time = end - start

  let min = (1 - ((document.getElementById('stu_intensity').value - 1) / 10))
  let max = document.getElementById('stu_intensity').value
  let frequency = document.getElementById('stu_frequency').value

  time = parseInt(time) / parseInt(frequency)
  let temp_time = parseInt(time) / multip;

  for (let i = 0; i < 10; i++) {

    if (Math.ceil(SVL) == Math.ceil((temp_time - (time * min)) / max)) break;

    SVL = (temp_time - (time * min)) / max
    time = temp_time - Math.ceil(SVL);

  }

  time = temp_time * multip;

  for (let j = 0; j < frequency; j++) {

    if (document.getElementById('tp_reverse').checked) {

      sv_string += (parseInt(start) + (time * j)) + ',' + (-100 / min) + ',1,1,0,100,0,0\n'
      if (SVL % 1 > 0) sv_string += ((parseInt(start) + (time * (j + 1))) - Math.ceil(SVL)) + ',' + (-100 / (SVL % 1 * max)) + ',1,1,0,100,0,0\n'
      sv_string += ((parseInt(start) + (time * (j + 1))) - Math.ceil(SVL)) + ',' + (-100 / max) + ',1,1,0,100,0,0\n'

    }
    else {

      sv_string += (parseInt(start) + (time * j)) + ',' + (-100 / max) + ',1,1,0,100,0,0\n'
      if (SVL % 1 > 0) sv_string += ((parseInt(start) + (time * j)) + Math.floor(SVL)) + ',' + (-100 / (SVL % 1 * max)) + ',1,1,0,100,0,0\n'
      sv_string += ((parseInt(start) + (time * j)) + Math.ceil(SVL)) + ',' + (-100 / min) + ',1,1,0,100,0,0\n'

    }
  }

  copy(sv_string)

}
function calculateSTOP() {

  let sv_string = '';

  let song_bpm = document.getElementById('stop_song_bpm').value;
  let current_bpm = document.getElementById('stop_current_bpm').value
  let multip = parseInt(song_bpm) / parseInt(current_bpm) * document.getElementById('stop_multi').value

  let start = parseTime(parseInt(interpString(document.getElementById('stop_start').value)))
  let end = parseTime(parseInt(interpString(document.getElementById('stop_end').value)))

  let time = end - start

  let bpm_time = 0;
  let extra_bpm = 6000000;

  let bpm_sv = 60000 / (time * (song_bpm * multip))

  if (bpm_sv < 1) { bpm_time = 1 / bpm_sv; bpm_sv = 1; }

  if (bpm_time > 1) { extra_bpm = (60000 / (song_bpm * multip)) * (bpm_time - Math.floor(bpm_time)); bpm_time = Math.floor(bpm_time) }


  if (document.getElementById('stop_reverse').checked) {
    sv_string = start + ',' + '6000000,4,1,0,100,1,0\n';
    if (bpm_time > 0) sv_string += ((end - 1) - bpm_time) + ',' + extra_bpm + ',4,1,0,100,1,0\n';
    sv_string += (end - 1) + ',' + bpm_sv + ',4,1,0,100,1,0\n';
    sv_string += end + ',' + (60000 / (current_bpm)) + ',4,1,0,100,1,0\n';

  }
  else {

    sv_string = start + ',' + bpm_sv + ',4,1,0,100,1,0\n';
    if (bpm_time > 0) sv_string += (start + bpm_time) + ',' + extra_bpm + ',4,1,0,100,1,0\n';
    sv_string += (start + bpm_time + 1) + ',' + '6000000,4,1,0,100,1,0\n';
    sv_string += end + ',' + (60000 / (current_bpm)) + ',4,1,0,100,1,0\n';

  }

  copy(sv_string)

}

/*

  <time>, 60000/<bpm>,1,1,0,100,0,0

*/