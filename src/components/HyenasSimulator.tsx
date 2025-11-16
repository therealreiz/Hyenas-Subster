import React, { useState } from "react";

type Ruolo = "Portiere" | "Difensore" | "Laterale SX" | "Laterale DX" | "Pivot";

interface Giocatore {
  nome: string;
  ruolo: Ruolo;
}

interface EventoSostituzione {
  minuto: number;
  out: string;
  in: string;
  ruolo: Ruolo;
}

export default function HyenasSimulator() {
  const initialTitolari: Giocatore[] = [
    { nome: "", ruolo: "Portiere" },
    { nome: "", ruolo: "Difensore" },
    { nome: "", ruolo: "Laterale SX" },
    { nome: "", ruolo: "Laterale DX" },
    { nome: "", ruolo: "Pivot" },
  ];

  const initialPanchina: Giocatore[] = [
    { nome: "", ruolo: "Difensore" },
    { nome: "", ruolo: "Laterale DX" },
    { nome: "", ruolo: "Laterale SX" },
  ];

  const [durata, setDurata] = useState<number | "">("");
  const [numCambi, setNumCambi] = useState<number | "">("");
  const [gap, setGap] = useState<number | "">("");

  const [titolari, setTitolari] = useState<Giocatore[]>(initialTitolari);
  const [panchina, setPanchina] = useState<Giocatore[]>(initialPanchina);
  const [eventi, setEventi] = useState<EventoSostituzione[]>([]);
  const [simulazioneAvviata, setSimulazioneAvviata] = useState(false);

  const aggiungiPanchinaro = () =>
    setPanchina((prev) => [...prev, { nome: "", ruolo: "Difensore" }]);

  const azzeraTutto = () => {
    setDurata("");
    setNumCambi("");
    setGap("");
    setTitolari(initialTitolari);
    setPanchina(initialPanchina);
    setEventi([]);
    setSimulazioneAvviata(false);
  };

  const generaSostituzioni = () => {
    if (!durata || !numCambi) return;

    const durataN = Number(durata);
    const numCambiN = Number(numCambi);
    const gapN = Number(gap) || 0;

    const eventiTemp: EventoSostituzione[] = [];
    const minutiUsati: number[] = [];

    let titolariTemp = [...titolari];
    let panchinaTemp = [...panchina];

    for (let i = 0; i < numCambiN; i++) {
      let minuto: number | null = null;
      let tentativi = 0;

      while (minuto === null && tentativi < 200) {
        tentativi++;
        const cand = Math.floor(Math.random() * durataN) + 1;

        const vicino = minutiUsati.some((m) => Math.abs(m - cand) < gapN);
        if (!vicino) minuto = cand;
      }

      if (minuto === null) continue;

      minutiUsati.push(minuto);

      const ruoliPossibili: Ruolo[] = [
        "Difensore",
        "Laterale SX",
        "Laterale DX",
        "Pivot",
      ];

      const ruoliDisponibili = ruoliPossibili.filter(
        (r) =>
          titolariTemp.some((t) => t.ruolo === r) &&
          panchinaTemp.some((p) => p.ruolo === r)
      );

      if (ruoliDisponibili.length === 0) continue;

      const ruolo =
        ruoliDisponibili[Math.floor(Math.random() * ruoliDisponibili.length)];
      const titIdx = titolariTemp.findIndex((t) => t.ruolo === ruolo);
      const panIdx = panchinaTemp.findIndex((p) => p.ruolo === ruolo);

      const outG = titolariTemp[titIdx];
      const inG = panchinaTemp[panIdx];

      eventiTemp.push({
        minuto,
        out: outG.nome || "(vuoto)",
        in: inG.nome || "(vuoto)",
        ruolo,
      });

      titolariTemp[titIdx] = { ...inG };
      panchinaTemp[panIdx] = { ...outG };
    }

    eventiTemp.sort((a, b) => a.minuto - b.minuto);
    setEventi(eventiTemp);
    setSimulazioneAvviata(true);
  };

  return (
    <>
      {/* LOGO INSTAGRAM */}
      <a
        href="https://instagram.com/hyenas_infinity"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/instagram.png" className="instagram-fixed" />
      </a>

      <div className="header-title">
        <img src="/logo.png" className="logo" />
        <h1 className="main-title">Hyenas FC – Simulatore</h1>
      </div>

      {/* PARAMETRI */}
      <div className="card">
        <h2>Parametri partita</h2>

        <input
          type="number"
          placeholder="Durata in minuti"
          value={durata}
          onChange={(e) =>
            setDurata(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Numero sostituzioni"
          value={numCambi}
          onChange={(e) =>
            setNumCambi(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Gap minimo (minuti)"
          value={gap}
          onChange={(e) =>
            setGap(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      {/* TITOLARI */}
      <div className="card">
        <h2>Titolari</h2>
        {titolari.map((t, i) => (
          <div key={i}>
            <label>{t.ruolo}</label>
            <input
              type="text"
              placeholder="Nome giocatore"
              value={t.nome}
              onChange={(e) => {
                const temp = [...titolari];
                temp[i].nome = e.target.value;
                setTitolari(temp);
              }}
            />
          </div>
        ))}
      </div>

      {/* PANCHINA */}
      <div className="card">
        <h2>Panchina</h2>
        {panchina.map((p, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder="Nome"
              value={p.nome}
              onChange={(e) => {
                const temp = [...panchina];
                temp[i].nome = e.target.value;
                setPanchina(temp);
              }}
            />

            <select
              value={p.ruolo}
              onChange={(e) => {
                const temp = [...panchina];
                temp[i].ruolo = e.target.value as Ruolo;
                setPanchina(temp);
              }}
            >
              <option>Difensore</option>
              <option>Laterale SX</option>
              <option>Laterale DX</option>
              <option>Pivot</option>
            </select>
          </div>
        ))}

        <button onClick={aggiungiPanchinaro}>Aggiungi panchinaro</button>
        <button
          className="secondary"
          onClick={() => setPanchina(initialPanchina)}
        >
          Ripristina panchina
        </button>
      </div>

      {/* CONTROLLI */}
      <div className="card">
        <h2>Controlli</h2>

        <button onClick={generaSostituzioni}>Avvia simulazione</button>
        <button className="secondary" onClick={azzeraTutto}>
          Azzera tutto
        </button>
      </div>

      {/* RISULTATI — SOLO SE LA SIMULAZIONE È PARTITA */}
      {simulazioneAvviata && (
        <div className="card">
          <h2>Risultato</h2>

          {eventi.length === 0 ? (
            <p>Nessuna sostituzione generata.</p>
          ) : (
            eventi.map((e, i) => (
              <div key={i} className="sostituzione">
                <strong>{e.minuto}'</strong> — {e.out} → {e.in} ({e.ruolo})
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
