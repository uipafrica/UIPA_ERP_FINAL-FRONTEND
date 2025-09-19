"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { leaveRequestApi } from "@/lib/api";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: any;
  userRole: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  open,
  onOpenChange,
  leaveRequest,
  userRole,
}) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const approvalMutation = useMutation({
    mutationFn: (data: any) =>
      leaveRequestApi.approve(
        leaveRequest._id || leaveRequest.id,
        data,
        localStorage.getItem("access_token") || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["leaveRequest", leaveRequest._id || leaveRequest.id],
      });
      onOpenChange(false);
      setAction(null);
      setComment("");
    },
    onError: (error) => {
      console.error("Failed to process approval:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!action) return;

    const submitData = {
      status: action === "approve" ? "approved" : "rejected",
      comment: comment || undefined,
    };

    approvalMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!approvalMutation.isPending) {
      onOpenChange(false);
      setAction(null);
      setComment("");
    }
  };

  const employeeName =
    leaveRequest?.employeeId?.name ||
    leaveRequest?.employee?.name ||
    "Unknown Employee";

  const leaveTypeName =
    leaveRequest?.leaveTypeId?.name ||
    leaveRequest?.leaveType?.name ||
    "Unknown Type";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Approve Leave Request</DialogTitle>
          <DialogDescription>
            Review and approve or reject this leave request from {employeeName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Request Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Employee:</span>
              <span className="text-sm">{employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Leave Type:</span>
              <span className="text-sm">{leaveTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">
                {leaveRequest?.totalDays || leaveRequest?.days} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Dates:</span>
              <span className="text-sm">
                {new Date(leaveRequest?.startDate).toLocaleDateString()} -{" "}
                {new Date(leaveRequest?.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm font-medium">Reason:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {leaveRequest?.reason}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action Selection */}
            <div>
              <Label className="text-sm font-medium">Decision *</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant={action === "approve" ? "default" : "outline"}
                  onClick={() => setAction("approve")}
                  disabled={approvalMutation.isPending}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  type="button"
                  variant={action === "reject" ? "destructive" : "outline"}
                  onClick={() => setAction("reject")}
                  disabled={approvalMutation.isPending}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <Label htmlFor="comment">Comments (Optional)</Label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={approvalMutation.isPending}
                placeholder="Add any comments about your decision..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none mt-2"
              />
            </div>

            {approvalMutation.error && (
              <div className="text-sm text-destructive">
                {approvalMutation.error instanceof Error
                  ? approvalMutation.error.message
                  : "Failed to process approval"}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={approvalMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={approvalMutation.isPending || !action}
                variant={action === "reject" ? "destructive" : "default"}
              >
                {approvalMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {action === "approve"
                  ? "Approve Request"
                  : action === "reject"
                  ? "Reject Request"
                  : "Select Action"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
