"use client";
import { useEffect, useState } from "react";
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  isBefore,
} from "date-fns";

export default function Timer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();

    if (isBefore(expiresAt, now)) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = differenceInSeconds(expiresAt, now);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [expiresAt]);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <div>
      {hours === 0 && minutes === 0 && seconds === 0 ? (
        <p>Time&apos;s up!</p>
      ) : (
        <p>
          {hours}h {minutes}m {seconds}s
        </p>
      )}
    </div>
  );
}
