import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
    StyleSheet,
    View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const commodities: string[] = ['Anhydrite', 'Lithium', 'Scandium', 'Cooper', 'Gold', 'Phosphorus', 'Fluorite', 'Hectorite', 'Kaolin', 'Magnesium', 'Coal', 'Beryllium-niobium', 'Vermiculite', 'Attapulgite', 'Manganese', 'Tungsten', 'Palladium', 'Rubidium', 'Sapphire', 'Tin', 'Topaz', 'Asbestos', 'Diamond', 'Rare Earth Elements', 'Graphite', 'Sulfur', 'Opal', 'Aquamarine', 'Jade', 'Cadmium',  'Bentonite', 'Platinum Group Elements', 'Tantalum', 'Thorium', 'Sylvite', 'Vanadium', 'Potash', 'Emerald', 'Clay', 'Mercury', 'Bromine', 'Rhodochrosite', 'Fluorine', 'Arsenic', 'Calcite', 'Selenium', 'Zinc', 'Strontium', 'Phosphate', 'Soda Ash', 'Pyrophyllite', 'Dolomite', 'Cesium', 'Tellurium', 'Beryllium', 'Diatomite', 'Garnet', 'Platinum', 'Nepheline syenite', 'Silver', 'Iron', 'Lithium mica', 'Zircon', 'Tourmaline', 'Fluorspar', 'Niobium', 'Phosphorous', 'Barite', 'Mercury', 'Bauxite', 'Molybdenum', 'Lead', 'Gypsum', 'Feldspathic sand', 'Olivine', 'Nitrate', 'Mica', 'Beryllium-tantalum', 'Silica', 'Iodine', 'Muscovite', 'Sodiumcarbonate', 'Zeolite', 'Feldspar', 'Cobalt', 'Corundum', 'Halite', 'Barium', 'Kunzite', 'Sillimanite', 'Copper', 'Barite', 'Silicasand', 'Magnesia', 'Pumice', 'Chromium',   'Phlogopite', 'Zirconium', 'Magnetite', 'Andalusite', 'Amethyst', 'Uranium', 'Cryolite', 'Alunite', 'Perlite', 'Gemstones', 'Ruby', 'Lapis lazuli', 'Gypsum',  'Amber', 'Phosphate rock', 'Nickel', 'Talc', 'Sodium Sulfate', 'Antimony', 'Boron', 'Fluorine', 'Sodium', 'Spinel', 'Limestone', 'Potassium', 'Peridot', 'Wollastonite', 'Mica', 'Magnesite', 'Sepiolite', 'Tin', 'Beryl', 'Kaolinite', 'Calium Carbonate', 'Titanium', 'Halloysite', 'Sodium Chloride', 'Saponite', 'Marble', 'Aluminum', 'Phosphaterock', 'Fluorspar', 'Chromium'];


export default function CommoditiesFilters() {
    const list = commodities.map((str) => (
        <BouncyCheckbox
            text={str}
            size={30}
            textStyle={styles.textStyle}
            iconStyle={styles.checkBox}
            innerIconStyle={styles.checkBox}
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