export default function CornerBrackets() {
  return (
    <>
      <div
        className="absolute z-20 w-[18px] h-[18px] border-t border-l border-[#4caf6e] opacity-[0.18]"
        style={{ top: 14, left: 18 }}
      />
      <div
        className="absolute z-20 w-[18px] h-[18px] border-t border-r border-[#4caf6e] opacity-[0.18]"
        style={{ top: 14, right: 18 }}
      />
      <div
        className="absolute z-20 w-[18px] h-[18px] border-b border-l border-[#4caf6e] opacity-[0.18]"
        style={{ bottom: 295, left: 18 }}
      />
      <div
        className="absolute z-20 w-[18px] h-[18px] border-b border-r border-[#4caf6e] opacity-[0.18]"
        style={{ bottom: 295, right: 18 }}
      />
    </>
  )
}
