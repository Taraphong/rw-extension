# Rusted Warfare Mod Tools

เครื่องมือเสริมสำหรับเขียนและตรวจสอบไฟล์ยูนิต `.ini` ของเกม **Rusted Warfare** ใน VS Code และ IDE ที่รองรับส่วนขยายรูปแบบ VS Code

โปรเจกต์นี้ช่วยให้การทำม็อดสะดวกขึ้นด้วย syntax highlighting, autocomplete, snippets, hover documentation และ diagnostics ที่อ้างอิงจาก *Rusted Warfare: Unit Modding Reference 1.16*

## ความสามารถหลัก

- Syntax highlighting สำหรับ section, key, comment, boolean, ตัวเลข, ตัวแปร และค่าในไฟล์ `.ini`
- Autocomplete สำหรับ key และชื่อ section ที่ใช้บ่อย โดยกรองตาม section ปัจจุบัน
- แนะนำค่าพิเศษและค่าแบบ enum เช่น `movementType`, `drawType`, `shoot_flame` และ `shoot_sound`
- Snippets สำหรับสร้างโครงสร้าง unit, weapon, section และ note อย่างรวดเร็ว
- Hover documentation แสดงคำอธิบาย ประเภทข้อมูล และตัวอย่างการใช้งานของ key
- Diagnostics ตรวจสอบ key ที่อยู่ผิด section, key ที่จำเป็น, รูปแบบค่า และ reference ไปยัง projectile, animation หรือ effect ที่ไม่มีอยู่
- ตรวจสอบ path ของไฟล์รูปภาพและเสียงใน workspace ของม็อด
- Image autocomplete และ preview สำหรับรูปของ unit รวมถึง projectile sprite sheet
- คำสั่ง `Rusted Warfare: Preview Unit Structure` สำหรับเปิดแผงสรุป section และ key ในไฟล์ปัจจุบัน

## โครงสร้างโปรเจกต์

```text
.
├── extension/
│   ├── extension.js                 # โค้ดหลักของส่วนขยาย
│   ├── package.json                 # Manifest และการตั้งค่า VS Code
│   ├── syntaxes/                    # กฎ syntax highlighting
│   ├── snippets/                    # Snippets สำหรับไฟล์ Rusted Warfare
│   ├── assets/                      # รูปประกอบและ projectile sprite sheets
│   ├── catalog.json                 # รายชื่อ property จาก catalog หลัก
│   ├── definitions.json             # คำอธิบาย property
│   ├── examples.json                # ตัวอย่างค่า property
│   ├── section-catalog.json         # key ที่อนุญาตในแต่ละ section
│   └── xlsx-catalog.json            # catalog จาก Unit Modding Reference
├── extension.vsixmanifest           # Manifest สำหรับแพ็กเกจ VSIX
└── LICENSE
```

## การติดตั้งแบบ local

1. เปิด VS Code หรือ IDE ที่รองรับส่วนขยาย VS Code
2. หากมีไฟล์ VSIX ให้เปิดเมนู Extensions แล้วเลือก `Install from VSIX...`
3. หากติดตั้งจาก source โดยตรง ให้เปิดโฟลเดอร์ `extension/` ในโหมดพัฒนา หรือคัดลอกโฟลเดอร์นี้ไปยังโฟลเดอร์ extensions ของ IDE
4. Restart IDE หากจำเป็น
5. เปิดไฟล์ `.ini` ของม็อด แล้วเลือก language mode เป็น **Rusted Warfare INI** หากระบบยังเลือกให้อัตโนมัติไม่ได้

## ตัวอย่างไฟล์

```ini
[core]
name: exampleTank
mass: 8000
radius: 15
price: 500
maxHp: 1000

[graphics]
image: tank.png

[attack]
canAttack: true
canAttackFlyingUnits: false
canAttackLandUnits: true
canAttackUnderwaterUnits: false

[movement]
movementType: LAND
moveSpeed: 1.2
```

เมื่อเปิดไฟล์ลักษณะนี้ ส่วนขยายจะช่วยเติม key และค่า แสดงคำอธิบายเมื่อ hover และเตือนข้อผิดพลาดที่ตรวจพบใน editor

## คำสั่งที่มีให้ใช้

เปิด Command Palette แล้วค้นหา:

```text
Rusted Warfare: Preview Unit Structure
```

คำสั่งนี้จะแสดงภาพรวมของ section และ key ทั้งหมดในไฟล์ unit ปัจจุบัน เหมาะสำหรับตรวจโครงสร้างไฟล์ก่อนนำไปทดสอบในเกม

## แหล่งข้อมูลและขอบเขต

catalog หลักอ้างอิงจาก *Rusted Warfare: Unit Modding Reference 1.16* และรวมคำอธิบาย ประเภทข้อมูล และตัวอย่างไว้ในไฟล์ JSON ภายใน `extension/` เนื่องจาก property บางรายการขึ้นอยู่กับ section หรือเวอร์ชันของเกม ส่วนขยายจะแสดงเป็น `see reference` แทนการเดาประเภทข้อมูล

การตรวจสอบบางอย่างเป็น compatibility check สำหรับ syntax ที่พบในเกมหรือม็อดเวอร์ชันต่าง ๆ เช่น `turretImageScale` และ dynamic animation keys ดังนั้น warning บางรายการอาจเป็นคำแนะนำ ไม่ได้หมายความว่าไฟล์จะใช้งานไม่ได้เสมอไป

## การพัฒนา

โค้ดส่วนขยายใช้ JavaScript และ VS Code Extension API โดย entry point อยู่ที่ `extension/extension.js` ส่วนข้อมูล catalog แยกเก็บเป็น JSON เพื่อให้เพิ่ม property, description และ example ได้โดยไม่ต้องเปลี่ยนโครงสร้างหลักของ extension

ก่อนส่งการเปลี่ยนแปลง ควรตรวจสอบ autocomplete, hover, diagnostics และคำสั่ง Preview Unit Structure ด้วยไฟล์ `.ini` ตัวอย่าง

## License

โปรเจกต์นี้เผยแพร่ภายใต้ [MIT License](LICENSE)
