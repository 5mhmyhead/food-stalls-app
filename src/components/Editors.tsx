import {
  deleteCategory,
  deleteProduct,
  goBack,
  itemCount,
  openScreen,
  saveCategory,
  saveProduct,
  useCatalog,
} from "@/catalogStore";
import CategoryIcon, { CategoryCard } from "@/components/CategoryIcon";
import {
  COLORS,
  Card,
  F,
  FW,
  Heading,
  IconBtn,
  Page,
  PillButton,
  Thumb,
  u,
} from "@/components/Ui";
import { peso } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const bubbles = [
  { size: 130, top: -65, left: 100 },
  { size: 55, top: 30, left: 215 },
];

const ICONS = [
  "croissant",
  "utensils",
  "knife",
  "cups",
  "burgers",
  "bbq",
  "coffee",
  "bowl",
  "fish",
  "crescent",
];

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function LabeledField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text
        style={{
          fontFamily: F.semi,
          fontSize: 11 * u,
          color: COLORS.navy,
          marginBottom: 6 * u,
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function Input({
  value,
  onChangeText,
  multiline,
  numeric,
}: {
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
  numeric?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={numeric ? "numeric" : "default"}
      selectionColor="#E8708C"
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 10 * u,
        height: (multiline ? 84 : 40) * u,
        paddingHorizontal: 12 * u,
        paddingTop: multiline ? 10 * u : 0,
        paddingBottom: 0,
        textAlignVertical: multiline ? "top" : "center",
        fontFamily: F.reg,
        fontSize: 12 * u,
        color: COLORS.navy,
      }}
    />
  );
}

export function EditProducts() {
  const { products } = useCatalog();

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card style={{ padding: 16 * u }}>
        <Heading size={30}>Edit Products</Heading>
        <View style={{ flexDirection: "row", marginTop: 12 * u }}>
          <PillButton
            title="Create New Product"
            onPress={() => openScreen("item", null)}
          />
        </View>
      </Card>

      <View style={{ gap: 12 * u, marginTop: 16 * u }}>
        {products.map((p) => (
          <Card key={p.id} style={{ padding: 8 * u }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10 * u,
              }}
            >
              <Thumb
                width={120 * u}
                height={70}
                color={p.color}
                source={p.image ? { uri: p.image } : undefined}
              />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontFamily: F.semi,
                    fontSize: 13 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontFamily: F.reg,
                    fontSize: 9 * u,
                    color: COLORS.navy,
                  }}
                >
                  {p.category} · {peso(p.price)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8 * u,
                    marginTop: 10 * u,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => deleteProduct(p.id)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20 * u}
                      color={COLORS.pink}
                    />
                  </TouchableOpacity>
                  <View style={{ width: 110 * u }}>
                    <PillButton
                      title="Edit Product"
                      onPress={() => openScreen("item", p.id)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Page>
  );
}

export function EditCategories() {
  const { products, categories } = useCatalog();

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <Card style={{ padding: 16 * u }}>
        <Heading size={30}>Edit Categories</Heading>
        <View style={{ flexDirection: "row", marginTop: 12 * u }}>
          <PillButton
            title="Create New Category"
            onPress={() => openScreen("category", null)}
          />
        </View>
      </Card>

      <View style={{ gap: 12 * u, marginTop: 16 * u }}>
        {categories.map((c) => {
          const count = itemCount(products, c);
          const row = (
            <Card style={{ padding: 12 * u }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12 * u,
                }}
              >
                <View
                  style={{
                    width: 46 * u,
                    height: 46 * u,
                    borderRadius: 23 * u,
                    backgroundColor: c.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon
                    name={c.icon}
                    size={26 * u}
                    color={COLORS.navy}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontFamily: F.semi,
                      fontSize: 13 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {c.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: F.reg,
                      fontSize: 9 * u,
                      color: COLORS.navy,
                    }}
                  >
                    {`${count} ${count === 1 ? "item" : "items"}`}
                  </Text>
                </View>
              </View>
            </Card>
          );

          if (c.id === "all") return <View key={c.id}>{row}</View>;

          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.85}
              onPress={() => openScreen("category", c.id)}
            >
              {row}
            </TouchableOpacity>
          );
        })}
      </View>
    </Page>
  );
}

export function EditItem() {
  const { products, categories, editingId } = useCatalog();
  const existing = products.find((p) => p.id === editingId);
  const custom = categories.filter((c) => c.id !== "all");
  const choices = custom.length > 0 ? custom : categories;

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState(
    existing?.category ?? choices[0]?.name ?? "All Meals",
  );
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [stock, setStock] = useState(existing ? String(existing.stock) : "");
  const [image, setImage] = useState<string | undefined>(existing?.image);
  const [imageMessage, setImageMessage] = useState("");

  const priceNum = parseFloat(price);
  const stockNum = parseInt(stock || "0", 10);
  const valid =
    name.trim().length > 0 &&
    !isNaN(priceNum) &&
    priceNum >= 0 &&
    !isNaN(stockNum);

  const pickImage = async () => {
    setImageMessage("");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
      setImageMessage("That image is over 2MB. Pick a smaller one.");
      return;
    }
    setImage(asset.uri);
  };

  const onSave = () => {
    if (!valid) return;
    saveProduct({
      id: existing ? existing.id : null,
      name: name.trim(),
      description: description.trim(),
      category,
      price: priceNum,
      stock: stockNum,
      image,
    });
    goBack();
  };

  return (
    <Page
      headerHeight={100}
      bubbles={bubbles}
      left={<IconBtn name="arrow-back" onPress={goBack} />}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={pickImage}>
        <Card
          style={{
            height: 150 * u,
            padding: 0,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <>
              <Ionicons
                name="image-outline"
                size={30 * u}
                color={COLORS.navy}
              />
              <Text
                style={{
                  fontFamily: F.bold,
                  fontSize: 11 * u,
                  color: COLORS.navy,
                  marginTop: 6 * u,
                }}
              >
                Upload Files
              </Text>
              <Text
                style={{
                  fontFamily: F.reg,
                  fontSize: 8 * u,
                  color: COLORS.navy,
                }}
              >
                (maximum file upload size of 2MB)
              </Text>
            </>
          )}
        </Card>
      </TouchableOpacity>

      {image ? (
        <View style={{ flexDirection: "row", gap: 16 * u, marginTop: 8 * u }}>
          <TouchableOpacity activeOpacity={0.85} onPress={pickImage}>
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 11 * u,
                color: COLORS.pink,
              }}
            >
              Change image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setImage(undefined)}
          >
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 11 * u,
                color: COLORS.navy,
              }}
            >
              Remove image
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {imageMessage ? (
        <Text
          style={{
            fontFamily: F.reg,
            fontSize: 11 * u,
            color: COLORS.pink,
            marginTop: 8 * u,
          }}
        >
          {imageMessage}
        </Text>
      ) : null}

      <View style={{ marginTop: 18 * u, marginBottom: 12 * u }}>
        <Heading size={30}>Product Details</Heading>
      </View>

      <View style={{ gap: 14 * u }}>
        <LabeledField label="Product Name">
          <Input value={name} onChangeText={setName} />
        </LabeledField>

        <LabeledField label="Product Description (optional)">
          <Input value={description} onChangeText={setDescription} multiline />
        </LabeledField>

        <LabeledField label="Category">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -22 * u }}
            contentContainerStyle={{ paddingHorizontal: 22 * u, gap: 10 * u }}
          >
            {choices.map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                compact
                selected={c.name === category}
                onPress={() => setCategory(c.name)}
              />
            ))}
          </ScrollView>
        </LabeledField>

        <LabeledField label="Product Price">
          <Input value={price} onChangeText={setPrice} numeric />
        </LabeledField>

        <LabeledField label="Product Stock">
          <Input value={stock} onChangeText={setStock} numeric />
        </LabeledField>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 20 * u,
          opacity: valid ? 1 : 0.5,
        }}
      >
        <PillButton
          title={existing ? "Save Changes" : "Create Product"}
          onPress={onSave}
        />
      </View>
    </Page>
  );
}

export function CategoryForm() {
  const { products, categories, editingId } = useCatalog();
  const existing = categories.find((c) => c.id === editingId);
  const [name, setName] = useState(existing?.name ?? "");
  const [icon, setIcon] = useState<string>(existing?.icon ?? ICONS[0]);
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");

  const count = existing ? itemCount(products, existing) : 0;
  const ready = name.trim().length > 0;

  const onSave = () => {
    const error = saveCategory(existing ? existing.id : null, name, icon);
    if (error) {
      setMessage(error);
      return;
    }
    goBack();
  };

  const onDelete = () => {
    if (!existing) return;
    deleteCategory(existing.id);
    goBack();
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={goBack}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={{
          width: FW - 36 * u,
          backgroundColor: COLORS.card,
          borderRadius: 18 * u,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 16 * u,
        }}
      >
        <Heading size={30}>
          {existing ? "Edit Category" : "New Category"}
        </Heading>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 12,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowIcons(!showIcons)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: COLORS.cream,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CategoryIcon name={icon} size={32} color="#243759" />
            <View
              style={{
                position: "absolute",
                right: -4,
                bottom: -4,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#243759",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="pencil" size={9} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: F.reg,
                fontSize: 11,
                color: "#243759",
                marginBottom: 4,
              }}
            >
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                setMessage("");
              }}
              autoCorrect={false}
              selectionColor="#E8708C"
              style={{
                height: 34,
                borderRadius: 8,
                backgroundColor: COLORS.cream,
                paddingHorizontal: 10,
                paddingVertical: 0,
                fontFamily: F.reg,
                fontSize: 13,
                color: "#243759",
              }}
            />
          </View>
        </View>

        {showIcons ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
              padding: 8,
              borderRadius: 10,
              backgroundColor: COLORS.cream,
            }}
          >
            {ICONS.map((iconName) => {
              const active = iconName === icon;
              return (
                <TouchableOpacity
                  key={iconName}
                  activeOpacity={0.85}
                  onPress={() => {
                    setIcon(iconName);
                    setShowIcons(false);
                  }}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? COLORS.pink : COLORS.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryIcon name={iconName} size={26} color="#243759" />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {message ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 11,
              color: "#E8708C",
              marginTop: 8,
            }}
          >
            {message}
          </Text>
        ) : null}

        {existing && count === 0 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onDelete}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{
                fontFamily: F.semi,
                fontSize: 11,
                color: "#E8708C",
                textDecorationLine: "underline",
              }}
            >
              Delete Category
            </Text>
          </TouchableOpacity>
        ) : null}

        {existing && count > 0 ? (
          <Text
            style={{
              fontFamily: F.reg,
              fontSize: 10,
              color: "#243759",
              marginTop: 10,
            }}
          >
            This category has {count} items. Move or delete them to remove it.
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 * u, marginTop: 16 * u }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <PillButton title="Cancel" variant="navy" onPress={goBack} />
          </View>
          <View
            style={{ flex: 1, flexDirection: "row", opacity: ready ? 1 : 0.5 }}
          >
            <PillButton title="Save" onPress={onSave} />
          </View>
        </View>
      </View>
    </View>
  );
}
