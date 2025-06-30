import {
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import RNModal from "react-native-modal";

interface ModalProps {
    isVisible: boolean,
    children: React.ReactNode,
}

export default function Modal({ isVisible = false, children }: ModalProps) {
    return (
            <RNModal isVisible={isVisible}>
                {children}
            </RNModal>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})