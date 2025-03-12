"use client";
import React, { useState, FC, ReactNode } from "react";
import { useCreateAdminUserDialog } from "./adminUserRegistration.viewModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateAdminUserBody } from "@/types/usersTypes";

interface AdminUserDialogProps {
  token: string;
  children?: ReactNode;
}

const AdminUserDialog: FC<AdminUserDialogProps> = ({ token, children }) => {
  const [open, setOpen] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [formData, setFormData] = useState<CreateAdminUserBody | null>(null);

  const { form, handleCreateAdminUser, pendingCreate } =
    useCreateAdminUserDialog(token, () => {
      setOpen(false);
      setConfirmationStep(false);
    });

  const onSubmit = form.handleSubmit((data) => {
    setFormData(data);
    setConfirmationStep(true);
  });

  const handleConfirm = async () => {
    if (formData) {
      await handleCreateAdminUser(formData);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    if (confirmationStep) {
      setConfirmationStep(false);
    } else {
      setOpen(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setConfirmationStep(false);
      form.reset();
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {!confirmationStep ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Admin User</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter username"
                        value={field.value || ""}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        {...field}
                        placeholder="Enter email"
                        value={field.value || ""}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter password"
                        value={field.value || ""}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="hidden">
                  <Button type="submit">Hidden Submit</Button>
                </div>
              </form>
            </Form>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={pendingCreate}>
                {pendingCreate ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Creation</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to create this admin user?</p>
              {formData && (
                <div className="mt-4 rounded-md bg-gray-50 p-4">
                  <p>
                    <strong>Username:</strong> {formData.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={pendingCreate}>
                {pendingCreate ? "Creating..." : "Confirm"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserDialog;
