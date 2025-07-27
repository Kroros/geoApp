import React, { useCallback, memo, useMemo } from "react";
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
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Config from "../app/config";
import { FlashList } from "@shopify/flash-list";


interface Props {
    items: string[],
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
}

export default function CheckBoxFilters({ items, selectedItems, setSelectedItems }: Props) {
    /* let labels: Set<string> = items;
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
        return (
        <BouncyCheckbox 
            text = {item}
            onPress={() => toggleItem()}
        />
        )
    });

    return (
            <FlatList
                data={Array.from(items)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <RenderItem item={item} />
                )}
            />
    ) */

    const toggleItem = useCallback((item: string) => {
        setSelectedItems(prev => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item)
            } else {
                return [...prev, item]
            }
        })
    }, [setSelectedItems])

    const list = items.map((item) => (
        <BouncyCheckbox 
            key = {item}
            text = {item}
            textStyle = {styles.textStyle}
            iconStyle = {styles.checkBox}
            innerIconStyle = {styles.checkBox}
            onPress={() => {
                toggleItem(item)
            }}
        />
    ));

    return(
        <View style={{width: "100%"}}>
            {list}
        </View>
    );
   
}

const styles = StyleSheet.create({
    textStyle: {
        textDecorationLine: "none",
    },
    checkBox: {
        borderRadius: 0
    }
})