import { useState } from "react";

type Ruolo = "Portiere" | "Difensore" | "Laterale SX" | "Laterale DX" | "Pivot";

interface Giocatore {
  nome: string;
  ruolo: Ruolo;
}

interface Evento {
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
    { nome: "", ruolo: "Laterale SX" },
    { nome: "", ruolo: "Laterale DX" },
    { nome: "", ruolo: "Pivot" },
  ];

  const [durata, setDurata] = useState<number | "">("");
  const [intervallo, setIntervallo] = useState<number | "">("");
  const [titolari, setTitolari] = useState<Giocatore[]>(initialTitolari);
  const [panchina, setPanchina] = useState<Giocatore[]>(initialPanchina);
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [attivo, setAttivo] = useState(false);

  const azzera = () => {
    setDurata("");
    setIntervallo("");
    setTitolari(initialTitolari);
    setPanchina(initialPanchina);
    setEventi([]);
    setAttivo(false);
  };

  const genera = () => {
    if (!durata || !intervallo) return;

    const durataN = Number(durata);
    const intervalloN = Number(intervallo);

    const minuti: number[] = [];
    for (let m = intervalloN; m <= durataN; m += intervalloN) {
      minuti.push(Number(m.toFixed(2)));
    }

    const eventiTemp: Evento[] = [];
    const ruoli: Ruolo[] = ["Difensore", "Laterale SX", "Laterale DX", "Pivot"];

    const rotazione: Record<Ruolo, Giocatore[]> = {
      Difensore: [],
      "Laterale SX": [],
      "Laterale DX": [],
      Pivot: [],
      Portiere: [],
    };

    [...titolari, ...panchina].forEach((g) => {
      if (g.ruolo !== "Portiere") rotazione[g.ruolo].push(g);
    });

    ruoli.forEach((r) => {
      const tit = titolari.find((t) => t.ruolo === r);
      const altri = rotazione[r].filter((p) => p.nome !== tit?.nome);
      rotazione[r] = [tit!, ...altri];
    });

    let indexRuolo = 0;
    minuti.forEach((minuto) => {
      const ruolo = ruoli[indexRuolo];
      const lista = rotazione[ruolo];

      if (lista.length < 2) return;

      const out = lista[0];
      const inn = lista[1];

      eventiTemp.push({
        minuto,
        out: out.nome || "(vuoto)",
        in: inn.nome || "(vuoto)",
        ruolo: ruolo,
      });

      lista.push(lista.shift()!);
      indexRuolo = (indexRuolo + 1) % ruoli.length;
    });

    setEventi(eventiTemp);
    setAttivo(true);
  };

  return (
    <div className="main-container">
      {/* LOGO INSTAGRAM */}
      <a
        href="https://instagram.com/hyenas_infinity"
        target="_blank"
        rel="noreferrer"
      >
        <img src="/instagram.png" className="instagram-fixed" />
      </a>

      {/* HEADER */}
      <div className="header-title">
        <img src="/logo.png" className="logo" />
        <h1 className="main-title">Hyenas FC</h1>
      </div>

      {/* PARAMETRI */}
      <div className="card">
        <h2>Parametri partita</h2>
        <input
          type="number"
          placeholder="Durata totale (minuti)"
          value={durata}
          onChange={(e) =>
            setDurata(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        <input
          type="number"
          step="0.1"
          placeholder="Intervallo cambi (es: 2.5)"
          value={intervallo}
          onChange={(e) =>
            setIntervallo(e.target.value === "" ? "" : Number(e.target.value))
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
            <label>Nome</label>
            <input
              type="text"
              value={p.nome}
              onChange={(e) => {
                const temp = [...panchina];
                temp[i].nome = e.target.value;
                setPanchina(temp);
              }}
            />
            <label>Ruolo</label>
            <select
              value={p.ruolo}
              onChange={(e) => {
                const temp = [...panchina];
                temp[i].ruolo = e.target.value as Ruolo;
                setPanchina(temp);
              }}
            >
              <option value="Difensore">Difensore</option>
              <option value="Laterale SX">Laterale SX</option>
              <option value="Laterale DX">Laterale DX</option>
              <option value="Pivot">Pivot</option>
            </select>
            <button
              className="secondary"
              onClick={() =>
                setPanchina((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              Rimuovi
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setPanchina((prev) => [...prev, { nome: "", ruolo: "Difensore" }])
          }
        >
          Aggiungi panchinaro
        </button>
      </div>

      {/* CONTROLLI */}
      <div className="card">
        <button onClick={genera}>Genera rotazione</button>
        <button className="secondary" onClick={azzera}>
          Azzera
        </button>
      </div>

      {/* RISULTATI */}
      {attivo && (
        <div className="card">
          <h2>Rotazione</h2>
          {eventi.map((e, i) => (
            <div key={i} className="sostituzione">
              <strong>{e.minuto}'</strong> — {e.out} → {e.in} ({e.ruolo})
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 Hyenas FC. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
