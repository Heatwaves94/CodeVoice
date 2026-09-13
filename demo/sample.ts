/**
 * demo/sample.ts — CodeVoice target file
 * This is the file that CodeVoice's Code Agent reads and writes.
 * Voice commands like "create a function that validates email" will modify this file.
 */

// ── Starter scaffold ──────────────────────────────────────────────────────────
// CodeVoice will generate, edit, and refactor code here during the demo.

export {};

// >>> CodeVoice will write code below this line <<<

/**
 * Assembly API module for managing assembly items, bills of materials (BOM),
 * and assembly execution tracking.
 */

export interface AssemblyItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
}

export interface BillOfMaterials {
  id: string;
  assemblySku: string;
  components: AssemblyItem[];
  version: number;
}

export interface AssemblyOrder {
  id: string;
  bomId: string;
  targetQuantity: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
}

// In-memory data stores for demonstration
const boms: Map<string, BillOfMaterials> = new Map();
const orders: Map<string, AssemblyOrder> = new Map();

/**
 * Creates or updates a Bill of Materials (BOM)
 */
export async function saveBillOfMaterials(bom: BillOfMaterials): Promise<BillOfMaterials> {
  if (!bom.id || !bom.assemblySku || !bom.components) {
    throw new Error('Invalid BOM structure provided.');
  }
  boms.set(bom.id, bom);
  return bom;
}

/**
 * Retrieves a Bill of Materials by its ID
 */
export async function getBillOfMaterials(id: string): Promise<BillOfMaterials> {
  const bom = boms.get(id);
  if (!bom) {
    throw new Error(`BOM with id ${id} not found.`);
  }
  return bom;
}

/**
 * Creates a new assembly order based on a BOM
 */
export async function createAssemblyOrder(bomId: string, targetQuantity: number): Promise<AssemblyOrder> {
  const bom = await getBillOfMaterials(bomId);
  if (!bom) {
    throw new Error(`Cannot create order: BOM ${bomId} does not exist.`);
  }

  const order: AssemblyOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    bomId,
    targetQuantity,
    status: 'PENDING',
    createdAt: new Date(),
  };

  orders.set(order.id, order);
  return order;
}

/**
 * Updates the status of an assembly order
 */
export async function updateOrderStatus(orderId: string, status: AssemblyOrder['status']): Promise<AssemblyOrder> {
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Assembly order with id ${orderId} not found.`);
  }

  order.status = status;
  if (status === 'COMPLETED') {
    order.completedAt = new Date();
  }

  orders.set(orderId, order);
  return order;
}

/**
 * Retrieves all assembly orders
 */
export async function listAssemblyOrders(): Promise<AssemblyOrder[]> {
  return Array.from(orders.values());
}

/**
 * Generates a C program string that implements a basic assembly management simulation
 * and returns it as a formatted TypeScript string.
 */
export async function generateAssemblyCProgram(): Promise<string> {
  const cCode = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef enum {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED
} OrderStatus;

typedef struct {
    char id[32];
    char sku[32];
    char name[64];
    int quantity;
} AssemblyItem;

typedef struct {
    char id[32];
    char assemblySku[32];
    AssemblyItem components[10];
    int componentCount;
    int version;
} BillOfMaterials;

typedef struct {
    char id[32];
    char bomId[32];
    int targetQuantity;
    OrderStatus status;
    time_t createdAt;
    time_t completedAt;
} AssemblyOrder;

void printOrderStatus(OrderStatus status) {
    switch(status) {
        case PENDING: printf("PENDING\\n"); break;
        case IN_PROGRESS: printf("IN_PROGRESS\\n"); break;
        case COMPLETED: printf("COMPLETED\\n"); break;
        case FAILED: printf("FAILED\\n"); break;
    }
}

int main() {
    printf("Initializing Assembly Management System...\\n");
    
    BillOfMaterials bom;
    strcpy(bom.id, "bom_001");
    strcpy(bom.assemblySku, "SKU-PROD-99");
    bom.version = 1;
    bom.componentCount = 1;

    strcpy(bom.components[0].id, "item_01");
    strcpy(bom.components[0].sku, "SKU-PART-01");
    strcpy(bom.components[0].name, "Control Board");
    bom.components[0].quantity = 2;

    AssemblyOrder order;
    strcpy(order.id, "ord_1001");
    strcpy(order.bomId, bom.id);
    order.targetQuantity = 50;
    order.status = PENDING;
    order.createdAt = time(NULL);

    printf("Created Order: %s for BOM: %s\\n", order.id, order.bomId);
    printf("Initial Status: ");
    printOrderStatus(order.status);

    order.status = IN_PROGRESS;
    printf("Updated Status: ");
    printOrderStatus(order.status);

    return 0;
}
`;
  return cCode.trim();
}

/**
 * Adds two numbers together and returns the result.
 */
export async function addNumbers(a: number, b: number): Promise<number> {
  return a + b;
}

/**
 * Checks whether a given string is a palindrome (reads the same forwards and backwards).
 * Ignores case and non-alphanumeric characters.
 */
export async function isPalindrome(str: string): Promise<boolean> {
  if (typeof str !== 'string') {
    throw new Error('Input must be a valid string.');
  }
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

/**
 * Checks whether a given number is an Armstrong number (narcissistic number).
 * An Armstrong number is a number that is the sum of its own digits each raised to the power of the number of digits.
 */
export async function isArmstrongNumber(num: number): Promise<boolean> {
  if (typeof num !== 'number' || isNaN(num) || num < 0) {
    throw new Error('Input must be a valid non-negative number.');
  }

  const numStr = num.toString();
  const power = numStr.length;
  let sum = 0;

  for (let i = 0; i < power; i++) {
    sum += Math.pow(parseInt(numStr[i], 10), power);
  }

  return sum === num;
}

/**
 * Parses a spoken voice instruction string into a structured GitHub prompt format.
 */
export async function createGithubPrompt(voiceInput: string): Promise<{ title: string; body: string; labels: string[] }> {
  if (!voiceInput || typeof voiceInput !== 'string') {
    throw new Error('A valid voice instruction string is required.');
  }

  const cleanedInput = voiceInput.trim();
  const title = cleanedInput.length > 50 ? `${cleanedInput.substring(0, 47)}...` : cleanedInput;

  const body = `### Voice Instruction\n> "${cleanedInput}"\n\n### Description\nThis task was automatically generated via voice command through CodeVoice. Please implement the requested changes following standard repository guidelines.`;

  return {
    title,
    body,
    labels: ['voice-generated', 'enhancement']
  };
}

/**
 * Raises the given line number by increasing its numerical value or returning an incremented index.
 */
export async function raiseLineNumber(lineNumber: number): Promise<number> {
  if (typeof lineNumber !== 'number' || isNaN(lineNumber)) {
    throw