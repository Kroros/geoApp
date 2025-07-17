import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
    StyleSheet,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface Props {
    selectedCommodities: string[];
    setSelectedCommodities: React.Dispatch<React.SetStateAction<string[]>>;
}

const commoditiesSet: Set<string> = new Set(['Anhydrite', 'Lithium', 'Scandium', 'Cooper', 'Gold', 'Phosphorus', 'Fluorite', 'Hectorite', 'Kaolin', 'Magnesium', 'Coal', 'Beryllium-niobium', 'Vermiculite', 'Attapulgite', 'Manganese', 'Tungsten', 'Palladium', 'Rubidium', 'Sapphire', 'Tin', 'Topaz', 'Asbestos', 'Diamond', 'Rare Earth Elements', 'Graphite', 'Sulfur', 'Opal', 'Aquamarine', 'Jade', 'Cadmium',  'Bentonite', 'Platinum Group Elements', 'Tantalum', 'Thorium', 'Sylvite', 'Vanadium', 'Potash', 'Emerald', 'Clay', 'Mercury', 'Bromine', 'Rhodochrosite', 'Fluorine', 'Arsenic', 'Calcite', 'Selenium', 'Zinc', 'Strontium', 'Phosphate', 'Soda Ash', 'Pyrophyllite', 'Dolomite', 'Cesium', 'Tellurium', 'Beryllium', 'Diatomite', 'Garnet', 'Nepheline syenite', 'Silver', 'Iron', 'Lithium mica', 'Zircon', 'Tourmaline', 'Fluorspar', 'Niobium', 'Phosphorous', 'Barite', 'Bauxite', 'Molybdenum', 'Lead', 'Feldspathic sand', 'Olivine', 'Nitrate', 'Beryllium-tantalum', 'Silica', 'Iodine', 'Muscovite', 'Sodiumcarbonate', 'Zeolite', 'Feldspar', 'Cobalt', 'Corundum', 'Halite', 'Barium', 'Kunzite', 'Sillimanite', 'Copper', 'Silicasand', 'Magnesia', 'Pumice', 'Chromium',   'Phlogopite', 'Zirconium', 'Magnetite', 'Andalusite', 'Amethyst', 'Uranium', 'Cryolite', 'Alunite', 'Perlite', 'Gemstones', 'Ruby', 'Lapis lazuli', 'Gypsum',  'Amber', 'Phosphate rock', 'Nickel', 'Talc', 'Sodium Sulfate', 'Antimony', 'Boron', 'Sodium', 'Spinel', 'Limestone', 'Potassium', 'Peridot', 'Wollastonite', 'Mica', 'Magnesite', 'Sepiolite', 'Beryl', 'Kaolinite', 'Calium Carbonate', 'Titanium', 'Halloysite', 'Sodium Chloride', 'Saponite', 'Marble', 'Aluminum', 'Phosphaterock', 'Fluorspar', 'Chromium']);
const commodities: string[] = Array.from(commoditiesSet).sort()

export default function CommoditiesFilters({ selectedCommodities, setSelectedCommodities }: Props) {
    const toggleCommodity = (commodity: string) => {
        setSelectedCommodities(prev => {
            if (prev.includes(commodity)) {
                return prev.filter(c => c !== commodity)
            } else {
                return [...prev, commodity]
            }
        })
    }
    
    const list = commodities.map((commodity) => (
        <BouncyCheckbox
            key={commodity}
            text={commodity}
            textStyle={styles.textStyle}
            iconStyle={styles.checkBox}
            innerIconStyle={styles.checkBox}
            onPress={() => {
                toggleCommodity(commodity)
            }}
            />
    ));

    return(
        <View style={{width: "100%"}}>
            {list}
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        textDecorationLine: "none",
    },
    checkBox: {
        borderRadius: 0
    }
})