import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAUTH_CONFIG } from "@/config/oauth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthLoading, setOAuthLoading] = useState(false);

  // Initialize Facebook SDK
  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function () {
      FB.init({
        appId: OAUTH_CONFIG.FACEBOOK_APP_ID,
        xfbml: true,
        version: "v18.0",
      });
    };

    // Load the Facebook SDK script
    if (!window.FB) {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock authentication
      if (email === "admin@vms.com" && password === "password123") {
        localStorage.setItem("authToken", "mock_token_" + Date.now());
        navigate("/signup");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setOAuthLoading(true);
    setError("");
    try {
      // Send token to backend for verification
      const response = await fetch(`${OAUTH_CONFIG.API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token and redirect to signup
        localStorage.setItem("authToken", data.token);
        navigate("/signup");
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (err) {
      setError("Google login error. Please try again.");
      console.error("Google login error:", err);
    } finally {
      setOAuthLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
    setOAuthLoading(false);
  };

  const handleFacebookLogin = async () => {
    if (!window.FB) {
      setError("Facebook SDK not loaded. Please try again.");
      return;
    }

    setOAuthLoading(true);
    setError("");

    FB.login(
      async (response) => {
        if (response.authResponse) {
          try {
            // Get user info
            FB.api("/me", { fields: "id,name,email,picture" }, async (userInfo) => {
              // Send token to backend for verification
              const res = await fetch(`${OAUTH_CONFIG.API_BASE_URL}/auth/facebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  accessToken: response.authResponse.accessToken,
                  userID: response.authResponse.userID,
                }),
              });

              if (res.ok) {
                const data = await res.json();
                // Store token and redirect to signup
                localStorage.setItem("authToken", data.token);
                navigate("/signup");
              } else {
                setError("Facebook login failed. Please try again.");
              }
              setOAuthLoading(false);
            });
          } catch (err) {
            setError("Facebook login error. Please try again.");
            console.error("Facebook login error:", err);
            setOAuthLoading(false);
          }
        } else {
          setError("Facebook login failed. Please try again.");
          setOAuthLoading(false);
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg p-8 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border"></div>
          <span className="text-xs text-muted-foreground font-medium">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-border"></div>
        </div>

        {/* Social Login */}
        <div className="mt-6 space-y-3">
          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          {/* Facebook Login Button */}
          <Button
            type="button"
            onClick={handleFacebookLogin}
            disabled={oauthLoading}
            className="w-full h-11 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{oauthLoading ? "Loading..." : "Facebook"}</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:text-primary/90 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials:</p>
          <p className="text-xs text-muted-foreground">Email: <span className="text-foreground">admin@vms.com</span></p>
          <p className="text-xs text-muted-foreground">Password: <span className="text-foreground">password123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
