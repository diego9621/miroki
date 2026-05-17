export default function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{
        fontFamily: "var(--font-shippori), serif",
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--m-text-primary)',
        lineHeight: 1,
        letterSpacing: '0.02em'
      }}>
        Miroki
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        <div style={{ width: 10, height: 2.5, borderRadius: 2, background: 'var(--m-accent)' }} />
        <div style={{ width: 10, height: 2.5, borderRadius: 2, background: 'var(--m-accent)' }} />
        <div style={{ width: 10, height: 2.5, borderRadius: 2, background: 'var(--m-accent)' }} />
        <div style={{ width: 10, height: 2.5, borderRadius: 2, background: 'var(--m-border-hover)' }} />
        <div style={{ width: 10, height: 2.5, borderRadius: 2, background: 'var(--m-border-hover)' }} />
      </div>
    </div>
  )
}