import React, { useState, useEffect, ReactNode, useRef, useCallback, memo, useMemo } from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Button,
    ScrollView,
    ListRenderItemInfo,
    Pressable
} from "react-native";
import { Checkbox } from "react-native-paper";
import Config from "../app/config";
import { FlashList } from "@shopify/flash-list";


interface Props {
    items: Set<string>
    selectedItems: Set<string>;
    setSelectedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function CheckBoxFilters({ items, selectedItems, setSelectedItems }: Props) {
    let labels: Set<string> = items;
    if (Array.from(items) == Config.DEFAULT_FEATURE_SELECTION) {
        labels = new Set(["Volcanoes", "Meteoric Craters", "Mineral Deposits"])
    }

    const toggleItem = useCallback((item: string) => {
        setSelectedItems((prev) => {
            const next = new Set(prev)
            if (prev.has(item)) {
                next.delete(item)
            } else {
                next.add(item)
            }
            return next;
        })
    }, [setSelectedItems])

    type RenderItemProp = {
        item: string;
    }

    const RenderItem = memo(({ item }: RenderItemProp) => {
        return (<Checkbox.Item
            label={Array.from(labels)[Array.from(items).indexOf(item)]}
            status={selectedItems.has(item) ? "checked" : "unchecked"}
            onPress={() => toggleItem(item)}
        />)
    });

    return (
            <FlatList
                data={Array.from(items)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <RenderItem item={item} />
                )}
            />
    )
   
}