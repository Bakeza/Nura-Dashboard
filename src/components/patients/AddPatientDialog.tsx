
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import PatientService from "@/services/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Copy, Link, Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form schema for initial patient data (just email)
const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// Form schema for complete patient data
const fullFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  date_of_birth: z.date({ required_error: "Date of birth is required" }),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender",
  }),
  phone_number: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailSchema>;
type FullFormData = z.infer<typeof fullFormSchema>;

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FullFormData) => void;
}

export const AddPatientDialog: React.FC<AddPatientDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<
    "email" | "invitation"
  >("email");
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientEmail, setPatientEmail] = useState<string>("");

  // Form for email-only step
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Reset the forms when the dialog closes
  useEffect(() => {
    if (!open) {
      setCurrentStep("email");
      setInvitationLink(null);
      setError(null);
      setPatientEmail("");
      emailForm.reset();
    }
  }, [open, emailForm]);

  // Function to generate invitation link
  const generateInvitationLink = async (email: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      setPatientEmail(email); // Store email for later use

      // Get the token from localStorage
      const token = localStorage.getItem("neurocog_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      console.log("email", email);
      const data = await PatientService.invitePatient(email);
      if (!data) {
        throw new Error("Failed to generate invitation link");
      }
      console.log("data", data);
      setInvitationLink(data.invitation_link);
      setCurrentStep("invitation");
    } catch (err) {
      console.error("Failed to generate invitation link:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate invitation link. Please try again."
      );
      toast.error(t("Failed to generate invitation link"));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle email form submission
  const handleEmailSubmit = (data: EmailFormData) => {
    generateInvitationLink(data.email);
  };

  // Copy invitation link to clipboard
  const copyToClipboard = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success(t("Invitation link copied to clipboard"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "email" && t("Invite New Patient")}
            {currentStep === "invitation" && t("Patient Invitation Link")}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "email" &&
              t("Enter patient email to generate an invitation link.")}
            {currentStep === "invitation" &&
              t("Send this link to the patient to complete registration.")}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type="email"
                          placeholder={t("Enter patient email")}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating
                    ? t("Generating...")
                    : t("Generate Invitation Link")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {currentStep === "invitation" && invitationLink && (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30">
              <div className="flex items-center mb-2">
                <Link className="h-4 w-4 mr-2 text-primary" />
                <h4 className="text-sm font-medium">{t("Invitation Link")}</h4>
              </div>
              <p className="text-sm break-all bg-background p-3 rounded border">
                {invitationLink}
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              <Button
                variant="outline"
                className="w-full"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("Copy Link")}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                {t("Done")}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              <p>
                {t(
                  "You can now send this link to the patient to complete registration."
                )}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
