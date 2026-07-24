(function () {
    const skyEl = document.getElementById('sky');
    const card = document.getElementById('card');
    const input = document.getElementById('cityInput');
    const suggestBox = document.getElementById('suggestions');
    const locBtn = document.getElementById('locBtn');
    const flash = document.getElementById('flash');

    let unit = 'c'; // c or f
    let currentData = null;

    // ---------- weather code -> group / description ----------
    function codeInfo(code) {
        const map = {
            0: ['clear', 'Clear sky'],
            1: ['clear', 'Mostly clear'],
            2: ['clouds', 'Partly cloudy'],
            3: ['clouds', 'Overcast'],
            45: ['fog', 'Fog'], 48: ['fog', 'Icy fog'],
            51: ['rain', 'Light drizzle'], 53: ['rain', 'Drizzle'], 55: ['rain', 'Dense drizzle'],
            56: ['rain', 'Freezing drizzle'], 57: ['rain', 'Freezing drizzle'],
            61: ['rain', 'Light rain'], 63: ['rain', 'Rain'], 65: ['rain', 'Heavy rain'],
            66: ['rain', 'Freezing rain'], 67: ['rain', 'Freezing rain'],
            71: ['snow', 'Light snow'], 73: ['snow', 'Snow'], 75: ['snow', 'Heavy snow'],
            77: ['snow', 'Snow grains'],
            80: ['rain', 'Rain showers'], 81: ['rain', 'Rain showers'], 82: ['rain', 'Violent showers'],
            85: ['snow', 'Snow showers'], 86: ['snow', 'Heavy snow showers'],
            95: ['storm', 'Thunderstorm'], 96: ['storm', 'Thunderstorm w/ hail'], 99: ['storm', 'Severe thunderstorm']
        };
        return map[code] || ['clouds', 'Unsettled'];
    }

    // ---------- icon svgs (small, currentColor based) ----------
    function icon(group, isDay) {
        const sun = `<circle cx="12" cy="12" r="5" fill="#ffc857"/><g stroke="#ffc857" stroke-width="2" stroke-linecap="round">
      <line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/>
      <line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/>
      <line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/>
      <line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"/></g>`;
        const moon = `<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#dfe6f2"/>`;
        const cloud = `<path d="M7 18a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17.4 10 4 4 0 0 1 17 18H7z" fill="#c9d3de"/>`;
        const cloudSun = `<g>${sun.replace('r="5"', 'r="4"')}</g><path transform="translate(1,2)" d="M7 18a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17.4 10 4 4 0 0 1 17 18H7z" fill="#dbe3ec"/>`;
        const cloudMoon = `<g>${moon}</g><path transform="translate(1,3)" d="M6 17a4 4 0 0 1-.4-8 5 5 0 0 1 9.6.9A3.6 3.6 0 0 1 15 17H6z" fill="#b9c3d1"/>`;
        const rain = `${cloud}<g stroke="#6fa8dc" stroke-width="2" stroke-linecap="round"><line x1="8" y1="19" x2="7" y2="22"/><line x1="12" y1="19" x2="11" y2="22"/><line x1="16" y1="19" x2="15" y2="22"/></g>`;
        const snow = `${cloud}<g fill="#eaf2fb"><circle cx="8" cy="20" r="1"/><circle cx="12" cy="21.5" r="1"/><circle cx="16" cy="20" r="1"/></g>`;
        const storm = `${cloud}<path d="M13 17l-3 5h3l-2 4 5-6h-3l2-3z" fill="#ffd166"/>`;
        const fog = `<g stroke="#c9d3de" stroke-width="2" stroke-linecap="round"><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="18" x2="21" y2="18"/></g>`;
        if (group === 'clear') return isDay ? sun : moon;
        if (group === 'clouds') return isDay ? cloudSun : cloudMoon;
        if (group === 'rain') return rain;
        if (group === 'snow') return snow;
        if (group === 'storm') return storm;
        if (group === 'fog') return fog;
        return cloud;
    }
    function iconSvg(group, isDay) {
        return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${icon(group, isDay)}</svg>`;
    }

    // ---------- sky scene builder ----------
    function buildSky(group, isDay) {
        skyEl.className = '';
        skyEl.innerHTML = '';
        skyEl.classList.add(`${group}-${isDay ? 'day' : 'night'}`);

        if (!isDay) {
            for (let i = 0; i < 50; i++) {
                const s = document.createElement('div');
                s.className = 'star';
                s.style.left = Math.random() * 100 + '%';
                s.style.top = Math.random() * 55 + '%';
                s.style.animationDelay = (Math.random() * 3) + 's';
                s.style.width = s.style.height = (Math.random() * 1.6 + 1) + 'px';
                skyEl.appendChild(s);
            }
        }

        if (group === 'clear') {
            const c = document.createElement('div');
            c.className = 'celestial' + (isDay ? '' : ' moon');
            skyEl.appendChild(c);
        }
        if (group === 'clouds' || group === 'fog' || group === 'rain' || group === 'snow' || group === 'storm') {
            if (group !== 'fog') {
                const c = document.createElement('div');
                c.className = 'celestial' + (isDay ? '' : ' moon');
                c.style.opacity = group === 'storm' ? '0.35' : '0.65';
                skyEl.appendChild(c);
            }
            const cloudCount = group === 'clouds' ? 4 : 3;
            for (let i = 0; i < cloudCount; i++) {
                const cw = document.createElement('div');
                cw.className = 'cloud-shape';
                const w = 140 + Math.random() * 120;
                cw.style.width = w + 'px';
                cw.style.height = (w * 0.5) + 'px';
                cw.style.top = (8 + Math.random() * 30) + '%';
                cw.style.animationDuration = (28 + Math.random() * 22) + 's';
                cw.style.animationDelay = (-Math.random() * 30) + 's';
                const shade = isDay ? '#ffffff' : '#3d4b5c';
                cw.innerHTML = `<svg viewBox="0 0 100 50"><path d="M15 40a13 13 0 0 1-1-26A16 16 0 0 1 45 8a12 12 0 0 1 22 8 11 11 0 0 1-2 24z" fill="${shade}" opacity="${isDay ? 0.9 : 0.7}"/></svg>`;
                skyEl.appendChild(cw);
            }
        }
        if (group === 'rain' || group === 'storm') {
            for (let i = 0; i < 40; i++) {
                const d = document.createElement('div');
                d.className = 'drop';
                d.style.left = Math.random() * 100 + '%';
                d.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
                d.style.animationDelay = (Math.random() * 2) + 's';
                d.style.height = (10 + Math.random() * 14) + 'px';
                skyEl.appendChild(d);
            }
        }
        if (group === 'snow') {
            for (let i = 0; i < 35; i++) {
                const f = document.createElement('div');
                f.className = 'flake';
                f.textContent = '❄';
                f.style.left = Math.random() * 100 + '%';
                f.style.fontSize = (8 + Math.random() * 10) + 'px';
                f.style.opacity = 0.4 + Math.random() * 0.6;
                f.style.animationDuration = (4 + Math.random() * 5) + 's';
                f.style.animationDelay = (Math.random() * 5) + 's';
                skyEl.appendChild(f);
            }
        }
        if (group === 'storm') {
            const doFlash = () => {
                flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on');
                setTimeout(doFlash, 4000 + Math.random() * 6000);
            };
            setTimeout(doFlash, 1500 + Math.random() * 3000);
        }
    }

    // ---------- rendering weather card ----------
    function fmtTemp(c) {
        const v = unit === 'c' ? c : (c * 9 / 5 + 32);
        return Math.round(v);
    }

    function render(data) {
        currentData = data;
        const cur = data.current;
        const [group, desc] = codeInfo(cur.weather_code);
        const isDay = cur.is_day === 1;
        buildSky(group, isDay);

        const now = new Date(data.timezoneNow);
        const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        let hourlyHtml = '';
        const nowIdx = data.hourly.time.findIndex(t => new Date(t) >= new Date(data.timezoneNow));
        const startIdx = Math.max(nowIdx, 0);
        for (let i = startIdx; i < startIdx + 24 && i < data.hourly.time.length; i += 1) {
            const t = new Date(data.hourly.time[i]);
            const [g] = codeInfo(data.hourly.weather_code[i]);
            const hIsDay = data.hourly.is_day ? data.hourly.is_day[i] === 1 : isDay;
            hourlyHtml += `<div class="hour-card">
        <div class="h-time">${i === startIdx ? 'Now' : t.toLocaleTimeString(undefined, { hour: 'numeric' })}</div>
        ${iconSvg(g, hIsDay)}
        <div class="h-temp">${fmtTemp(data.hourly.temperature_2m[i])}°</div>
      </div>`;
        }

        let dailyHtml = '';
        for (let i = 0; i < data.daily.time.length; i++) {
            const d = new Date(data.daily.time[i] + 'T12:00:00');
            const [g, desc2] = codeInfo(data.daily.weather_code[i]);
            const label = i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' });
            dailyHtml += `<div class="day-row">
        <div class="d-name">${label}</div>
        ${iconSvg(g, true)}
        <div class="d-desc">${desc2}</div>
        <div class="d-temps">${fmtTemp(data.daily.temperature_2m_max[i])}° <span class="lo">${fmtTemp(data.daily.temperature_2m_min[i])}°</span></div>
      </div>`;
        }

        card.innerHTML = `
      <div class="place-row">
        <div class="place-name">${data.placeName}</div>
        <div class="unit-toggle">
          <button data-unit="c" class="${unit === 'c' ? 'active' : ''}">°C</button>
          <button data-unit="f" class="${unit === 'f' ? 'active' : ''}">°F</button>
        </div>
      </div>
      <div class="datetime">${dateStr} · ${timeStr}</div>
      <div class="hero">
        <div class="temp-num">${fmtTemp(cur.temperature_2m)}<sup>°</sup></div>
        <div class="hero-icon">${iconSvg(group, isDay)}</div>
      </div>
      <div class="desc">${desc}</div>
      <div class="stat-row">
        <div class="stat"><div class="label">Feels like</div><div class="value">${fmtTemp(cur.apparent_temperature)}°</div></div>
        <div class="stat"><div class="label">Humidity</div><div class="value">${cur.relative_humidity_2m}%</div></div>
        <div class="stat"><div class="label">Wind</div><div class="value">${Math.round(cur.wind_speed_10m)} km/h</div></div>
      </div>
      <div class="section-label">Next 24 hours</div>
      <div class="hourly-strip">${hourlyHtml}</div>
      <div class="section-label">7-day outlook</div>
      <div class="daily-list">${dailyHtml}</div>
    `;

        card.querySelectorAll('.unit-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                unit = btn.dataset.unit;
                render(currentData);
            });
        });
    }

    function showState(title, sub) {
        card.innerHTML = `<div class="state-msg"><strong>${title}</strong>${sub}</div>`;
    }
    function showLoading(msg) {
        card.innerHTML = `<div class="state-msg"><div class="spinner"></div>${msg}</div>`;
    }

    // ---------- data fetching ----------
    async function fetchWeather(lat, lon, placeName) {
        showLoading('Reading the sky…');
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m` +
                `&hourly=temperature_2m,weather_code,is_day` +
                `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
                `&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('bad response');
            const json = await res.json();
            json.placeName = placeName;
            // compute "now" in the location's timezone by using timezone offset seconds
            const nowUtc = Date.now() + (new Date().getTimezoneOffset() * 60000);
            json.timezoneNow = new Date(nowUtc + json.utc_offset_seconds * 1000);
            render(json);
        } catch (err) {
            showState('Couldn\'t reach the sky', `<br>Check your connection and try searching again.`);
            console.error(err);
        }
    }

    async function geocode(query) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('geocode failed');
        const data = await res.json();
        if (data.results) {
            data.results = data.results.filter(r => r.country_code === 'IN');
        }
        return data;
    }

    // ---------- search + autocomplete ----------
    let debounceT;
    input.addEventListener('input', () => {
        clearTimeout(debounceT);
        const q = input.value.trim();
        if (q.length < 2) { suggestBox.classList.remove('show'); return; }
        debounceT = setTimeout(async () => {
            try {
                const data = await geocode(q);
                if (!data.results || !data.results.length) {
                    suggestBox.innerHTML = `<button disabled style="color:var(--dim);cursor:default;">No matches found</button>`;
                    suggestBox.classList.add('show');
                    return;
                }
                suggestBox.innerHTML = data.results.map(r => `
          <button data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${r.name}${r.admin1 ? ', ' + r.admin1 : ''}${r.country ? ', ' + r.country : ''}">
            ${r.name}${r.admin1 ? ', ' + r.admin1 : ''}
            <small>${r.country || ''}</small>
          </button>`).join('');
                suggestBox.classList.add('show');
            } catch (e) { console.error(e); }
        }, 350);
    });

    suggestBox.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-lat]');
        if (!btn) return;
        input.value = btn.dataset.name;
        suggestBox.classList.remove('show');
        fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) suggestBox.classList.remove('show');
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const first = suggestBox.querySelector('button[data-lat]');
            if (first) first.click();
        }
    });

    locBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            showState('Location unavailable', '<br>Your browser doesn\'t support geolocation. Try searching a city instead.');
            return;
        }
        showLoading('Finding you…');
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let name = 'Your location';
                try {
                    const rev = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=&count=1`); // no-op fallback
                } catch (e) { }
                fetchWeather(latitude, longitude, name);
            },
            () => { showState('Location blocked', '<br>Allow location access, or search for a city above.'); },
            { timeout: 8000 }
        );
    });

    // ---------- initial load ----------
    (function init() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, 'Your location'),
                () => fetchWeather(22.3072, 73.1812, 'Vadodara, Gujarat'),
                { timeout: 6000 }
            );
        } else {
            fetchWeather(22.3072, 73.1812, 'Vadodara, Gujarat');
        }
    })();
})();