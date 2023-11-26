"use client";
import { useEffect, useState } from "react";
//@ts-ignore
import DashboardSpinnigLoader from "@/app/components/widgets/DashboardSpinnigLoader";

interface OptionType {
    id: string;
    title: string;
    description: string;
    name: string;
    label: string;
}
export default function CKEditorComponent({ onChange , content , index, variables }: any) {
    

    return (
        
            
                <DashboardSpinnigLoader></DashboardSpinnigLoader>
            
         
        
    );
}
