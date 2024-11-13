"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status: sessionStatus } = useSession();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [licenseNumber, setLicenseNumber] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/");
    }
  }, [sessionStatus, router]);

  const validateForm = () => {
    if (name.length < 2) {
      setError("Name must be at least 2 characters long.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits long.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return false;
    }
    setError(null);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = {
      name,
      email,
      phone,
      address,
      licenseNumber, // Add license number only for customers
      password,
      confirmPassword,
    };
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 422)
        return toast({
          title: "Uh oh! Something went wrong.",
          description: "Please provide all input fields.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      if (res.status === 409)
        return toast({
          title: "User already exists",
          description: "This email is already registered.",
          action: (
            <ToastAction
              altText="Login"
              onClick={() => router.replace("/login")}
            >
              Login
            </ToastAction>
          ),
        });
      if (res.status === 400)
        return toast({
          title: "Passwords do not match.",
          description: "Your password and confirm password do not match.",
        });

      toast({
        title: "Registration",
        description: "User Registered successfully",
      });
      router.replace("/login");
    } catch (error) {
      console.log(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="container text-center h-screen flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create a new account to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label className="block mb-2 font-medium">Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">Phone</Label>
                <Input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">Address</Label>
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">
                  License Number (Only for Customers)
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label className="block mb-2 font-medium">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <div className="space-y-1">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </div>
                </Alert>
              )}
              <Button className="w-full mt-4" type="submit">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  );
}
