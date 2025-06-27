
const BlueGlowBackground = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-screen -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-20 -left-32 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-blue-500/5 via-purple-500/3 to-transparent"></div>
    </div>
  );
};

export default BlueGlowBackground;
