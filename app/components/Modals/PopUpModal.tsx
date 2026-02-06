import type { ReactNode } from "react";

type CommentPopupModalTypes = {
  onClose: () => void;
  children: ReactNode;
};

export default function CommentPopUpModal({
  onClose,
  children,
}: CommentPopupModalTypes) {
  return (
    <>
      <div onClick={onClose} className="absolute inset-0 bg-black/10"></div>
      <div
        className={`absolute flex flex-col justify-center w-1/2 px-6 py-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg gap-2`}
      >
        {children}
      </div>
    </>
  );
}
