import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Button,
    ListRenderItemInfo,
    Pressable
} from "react-native";
import { Checkbox } from "react-native-paper";
import Config from "../app/config";


interface Props {
    items: string[]
    selectedItems: string[];
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CheckBoxFilters({ items, selectedItems, setSelectedItems }: Props) {
    let labels: string[] = items;
    if (items == Config.DEFAULT_FEATURE_SELECTION) {
        labels = ["Volcanoes", "Meteoric Craters", "Mineral Deposits"]
    }

    const toggleItem = (item: string) => {
        setSelectedItems(prev => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item)
            } else {
                return [...prev, item]
            }
        })
    }

    const list = items.map((item) => {
        const isChecked = selectedItems.includes(item)
        return (
            <Checkbox.Item
                key={item}
                label={labels[items.indexOf(item)]}
                status={isChecked ? "checked" : "unchecked"}
                onPress={() => toggleItem(item)}
            />
        )
    });

    return (
        <View style={{width: "100%"}}>
            {list}
        </View>
    )
   
}