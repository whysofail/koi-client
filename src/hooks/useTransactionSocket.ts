import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@/types/transactionTypes";

type TransactionSocketType = "DEPOSIT_UPDATE";

interface SocketData {
  entity: "transaction";
  type: TransactionSocketType;
  data: Transaction;
}
interface UseTransactionSocketProps {
  authSocket: Socket | null;
  trasactionId?: string;
}

export const useTransactionSocket = ({
  authSocket,
}: UseTransactionSocketProps) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authSocket) return;
    setIsConnecting(true);
    authSocket.on("connect", () => {
      console.log("Connected to transaction authSocket");
      setIsConnected(true);
      setIsConnecting(false);
    });
    authSocket.on("connect_error", (err) => {
      setIsConnected(false);
      setIsConnecting(false);
      setError(err);
    });

    const handleUpdate = (data: SocketData) => {
      console.log("Received update", data);
      if (data.entity !== "transaction") return;

      // Invalidate on Socket update
      if (data.type) {
        console.log("Invalidating queries for transaction", data);
        queryClient.invalidateQueries({
          queryKey: ["transaction", data.data.transaction_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });
      }

      queryClient.setQueryData<Transaction>(
        ["transaction", data.data.transaction_id],
        (oldData) => {
          if (!oldData) return data.data;
          switch (data.type) {
            case "DEPOSIT_UPDATE":
              return {
                ...oldData,
                status: data.data.status,
              };
            default:
              return oldData;
          }
        },
      );
    };

    authSocket.on("update", handleUpdate);

    return () => {
      if (authSocket.connected) {
        authSocket.off("connect");
        authSocket.off("connect_error");
        authSocket.off("update", handleUpdate);
      }
    };
  }, [queryClient, authSocket]);
  return { isConnected, isConnecting, error };
};
