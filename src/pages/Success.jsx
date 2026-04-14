import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download, ArrowLeft, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { name = "Visitor" } = (location.state) || {};

  useEffect(() => {
    // Generate a simple QR-like pattern on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#1e293b";

    // Simple deterministic pattern based on name
    const seed = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const cellSize = 8;
    const count = size / cellSize;

    // Corner markers
    const drawMarker = (x, y) => {
      ctx.fillRect(x, y, cellSize * 3, cellSize * 3);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + cellSize, y + cellSize, cellSize, cellSize);
      ctx.fillStyle = "#1e293b";
    };
    drawMarker(cellSize, cellSize);
    drawMarker(size - cellSize * 4, cellSize);
    drawMarker(cellSize, size - cellSize * 4);

    // Data pattern
    for (let i = 5; i < count - 5; i++) {
      for (let j = 5; j < count - 5; j++) {
        if ((seed * (i + 1) * (j + 1)) % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [name]);

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `visitor-qr-${name.toLowerCase().replace(/\s/g, "-")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Welcome, <span className="font-semibold text-foreground">{name}</span>. Your visitor pass is ready.
        </p>

        {/* QR Card */}
        <div className="bg-card rounded-2xl card-shadow-lg p-8 mb-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
            <QrCode className="w-4 h-4" />
            <span>Visitor QR Code</span>
          </div>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-background rounded-xl border border-border">
              <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Show this QR code at the security desk for verification
          </p>
          <Button onClick={downloadQR} className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </div>

        <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Check-In
        </Button>
      </div>
    </div>
  );
};

export default Success;
