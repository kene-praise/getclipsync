
const BlueGlowBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      {/* Main gradient overlay covering the full section */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/8 to-cyan-500/10 rounded-3xl"></div>
      
      {/* Animated glow orbs for depth */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-cyan-500/8 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Additional soft gradient for better coverage */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10 rounded-3xl"></div>
    </div>
  );
};

export default BlueGlowBackground;
