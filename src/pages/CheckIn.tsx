import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, User, Phone, FileText, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CheckIn = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [host, setHost] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      alert("Unable to access camera. Please allow camera permissions.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setCapturedPhoto(dataUrl);
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((t) => t.stop());
      setCameraActive(false);
    }
  }, []);

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAadhaarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !purpose || !host) return;
    navigate("/success", { state: { name, phone, purpose, host } });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <UserCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Visitor Check-In</h1>
          <p className="text-muted-foreground mt-1">Please fill in your details below</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl card-shadow-lg p-6 sm:p-8 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30" required />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="phone" type="tel" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30" required />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Purpose of Visit</Label>
            <Select value={purpose} onValueChange={setPurpose} required>
              <SelectTrigger className="h-11 rounded-xl border-border bg-background">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select purpose" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Host */}
          <div className="space-y-2">
            <Label htmlFor="host" className="text-sm font-medium text-foreground">Host Name</Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="host" placeholder="Person you're visiting" value={host} onChange={(e) => setHost(e.target.value)} className="pl-10 h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30" required />
            </div>
          </div>

          {/* Camera */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Photo Capture</Label>
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              {capturedPhoto ? (
                <div className="relative">
                  <img src={capturedPhoto} alt="Captured" className="w-full h-48 object-cover" />
                  <button type="button" onClick={() => setCapturedPhoto(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : cameraActive ? (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover" />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center">
                    <Button type="button" onClick={capturePhoto} size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                      <Camera className="w-4 h-4 mr-1" /> Capture
                    </Button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={startCamera} className="w-full h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                  <Camera className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to open camera</span>
                </button>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Aadhaar Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Aadhaar Card Upload</Label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAadhaarUpload} className="hidden" />
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              {aadhaarPreview ? (
                <div className="relative">
                  <img src={aadhaarPreview} alt="Aadhaar" className="w-full h-36 object-contain p-2" />
                  <button type="button" onClick={() => setAadhaarPreview(null)} className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/60 text-primary-foreground hover:bg-foreground/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-36 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                  <Upload className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to upload Aadhaar</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg">
            Check In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;
