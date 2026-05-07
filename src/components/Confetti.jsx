import './Confetti.css'

const COLORS = ['#FF7A1A', '#FFD166', '#E85F00', '#FF9A4D', '#2FBF71', '#FFB347']

export default function Confetti() {
  return (
    <div className="confetti-wrap" aria-hidden>
      {Array.from({ length: 32 }).map((_, i) => (
        <span
          key={i}
          className="conf-piece"
          style={{
            left:              `${Math.random() * 100}vw`,
            background:        COLORS[i % COLORS.length],
            width:             `${5 + Math.random() * 8}px`,
            height:            `${5 + Math.random() * 8}px`,
            borderRadius:      Math.random() > 0.4 ? '50%' : '3px',
            animationDuration: `${1.4 + Math.random() * 2}s`,
            animationDelay:    `${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  )
}
