const fs = require("fs");
const { createCanvas } = require("canvas");

// Create a 1024x1024 canvas for BIMI logo
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext("2d");

// Fill with black background
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 1024, 1024);

// Draw white checkmark
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 82; // Scaled from original 16 to maintain proportions
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Scale coordinates from 100x100 to 1024x1024
const scale = 1024 / 100;

ctx.beginPath();
// Original SVG path: M20 50 L40 70 L80 30
ctx.moveTo(20 * scale, 50 * scale);
ctx.lineTo(40 * scale, 70 * scale);
ctx.lineTo(80 * scale, 30 * scale);
ctx.stroke();

// Save as PNG
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("logo.png", buffer);

console.log("BIMI logo created successfully as logo.png (1024x1024)");
console.log("File size:", buffer.length, "bytes");
