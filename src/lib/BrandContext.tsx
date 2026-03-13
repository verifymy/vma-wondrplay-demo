"use client";

import { createContext, useContext } from "react";
import { type Brand } from "./brand";

const BrandContext = createContext<Brand>("verifymy");

export const BrandProvider = BrandContext.Provider;
export const useBrand = () => useContext(BrandContext);
