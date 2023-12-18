"use client";

import { useEffect } from "react";

import { incrementViews } from "~/actions/views";

export const ViewsIncrementer = ({ id }: { id: string }) => {
  useEffect(() => {
    void incrementViews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
