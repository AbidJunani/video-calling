"use client";

import useUser from "@/app/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const Room = ({ params }: { params: { roomid: string } }) => {
  const { fullName } = useUser();
  const roomID = params.roomid;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myMeeting = async (element: HTMLDivElement | null) => {
      if (!element) return;

      // Generate Kit Token
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID!, 10);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        uuid(),
        fullName || "user" + Date.now(),
        720
      );

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Shareable link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        maxUsers: 10,
      });
    };

    if (containerRef.current) {
      myMeeting(containerRef.current);
    }
  }, [roomID, fullName]); // Include 'roomID' and 'fullName' as dependencies

  return <div className="w-full h-screen" ref={containerRef}></div>;
};

export default Room;
