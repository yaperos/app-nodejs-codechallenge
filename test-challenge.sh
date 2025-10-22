
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

API_URL="http://localhost:3000/api/v1"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🚀 YAPE TRANSACTION SERVICE - CHALLENGE END-TO-END TEST${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_health() {
    echo -e "${YELLOW}📊 Verificando salud del servicio...${NC}"
    HEALTH=$(curl -s "$API_URL/health")
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Servicio está funcionando correctamente${NC}"
        echo ""
    else
        echo -e "${RED}✗ Error: El servicio no está disponible${NC}"
        exit 1
    fi
}

create_transaction() {
    local value=$1
    local description=$2

    RESPONSE=$(curl -s -X POST "$API_URL/transactions" \
        -H "Content-Type: application/json" \
        -d "{
            \"externalId\": \"$(uuidgen)\",
            \"idempotencyKey\": \"test-$(date +%s)-$RANDOM\",
            \"type\": \"P2P\",
            \"amount\": $value,
            \"currency\": \"PEN\",
            \"sourceAccountId\": \"+51999888$(printf '%03d' $RANDOM)\",
            \"targetAccountId\": \"+51999888$(printf '%03d' $RANDOM)\",
            \"metadata\": {
                \"description\": \"$description\",
                \"test\": true
            }
        }")

    echo "$RESPONSE"
}

get_transaction() {
    local txn_id=$1
    curl -s "$API_URL/transactions/$txn_id"
}

wait_for_status() {
    local txn_id=$1
    local expected_status=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        CURRENT=$(curl -s "$API_URL/transactions/$txn_id" | jq -r '.data.status')

        if [ "$CURRENT" = "$expected_status" ]; then
            return 0
        fi

        if [ "$CURRENT" != "pending" ] && [ "$CURRENT" != "$expected_status" ]; then
            return 1
        fi

        sleep 1
        ((attempt++))
    done

    return 1
}

check_health

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 1: Transacción con value < 1000 (debe ser APPROVED)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}➜ Creando transacción con amount = 500 PEN...${NC}"
TXN1=$(create_transaction 500 "Pago por servicio - Debería ser aprobado")
TXN1_ID=$(echo "$TXN1" | jq -r '.data.id')
TXN1_STATUS=$(echo "$TXN1" | jq -r '.data.status')

if [ "$TXN1_ID" = "null" ] || [ -z "$TXN1_ID" ]; then
    echo -e "${RED}✗ Error al crear la transacción${NC}"
    echo "$TXN1" | jq '.'
    exit 1
fi

echo -e "${GREEN}✓ Transacción creada${NC}"
echo -e "  ID: ${YELLOW}$TXN1_ID${NC}"
echo -e "  Estado inicial: ${YELLOW}$TXN1_STATUS${NC}"
echo ""

echo -e "${YELLOW}⏳ Esperando procesamiento del anti-fraude...${NC}"
if wait_for_status "$TXN1_ID" "completed"; then
    FINAL1=$(get_transaction "$TXN1_ID")
    FINAL1_STATUS=$(echo "$FINAL1" | jq -r '.data.status')
    echo -e "${GREEN}✓ Transacción procesada${NC}"
    echo -e "  Estado final: ${GREEN}$FINAL1_STATUS${NC}"

    if [ "$FINAL1_STATUS" = "completed" ]; then
        echo -e "${GREEN}✅ TEST 1 PASSED: Transacción < 1000 fue APROBADA${NC}"
    else
        echo -e "${RED}❌ TEST 1 FAILED: Se esperaba 'completed', se obtuvo '$FINAL1_STATUS'${NC}"
    fi
else
    FINAL1=$(get_transaction "$TXN1_ID")
    FINAL1_STATUS=$(echo "$FINAL1" | jq -r '.data.status')
    echo -e "${RED}❌ TEST 1 FAILED: Timeout o estado incorrecto. Estado actual: $FINAL1_STATUS${NC}"
fi

echo ""
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 2: Transacción con value > 1000 (debe ser REJECTED)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}➜ Creando transacción con amount = 1500 PEN...${NC}"
TXN2=$(create_transaction 1500 "Pago grande - Debería ser rechazado")
TXN2_ID=$(echo "$TXN2" | jq -r '.data.id')
TXN2_STATUS=$(echo "$TXN2" | jq -r '.data.status')

if [ "$TXN2_ID" = "null" ] || [ -z "$TXN2_ID" ]; then
    echo -e "${RED}✗ Error al crear la transacción${NC}"
    echo "$TXN2" | jq '.'
    exit 1
fi

echo -e "${GREEN}✓ Transacción creada${NC}"
echo -e "  ID: ${YELLOW}$TXN2_ID${NC}"
echo -e "  Estado inicial: ${YELLOW}$TXN2_STATUS${NC}"
echo ""

echo -e "${YELLOW}⏳ Esperando procesamiento del anti-fraude...${NC}"
if wait_for_status "$TXN2_ID" "failed"; then
    FINAL2=$(get_transaction "$TXN2_ID")
    FINAL2_STATUS=$(echo "$FINAL2" | jq -r '.data.status')
    echo -e "${GREEN}✓ Transacción procesada${NC}"
    echo -e "  Estado final: ${RED}$FINAL2_STATUS${NC}"

    if [ "$FINAL2_STATUS" = "failed" ]; then
        echo -e "${GREEN}✅ TEST 2 PASSED: Transacción > 1000 fue RECHAZADA${NC}"
    else
        echo -e "${RED}❌ TEST 2 FAILED: Se esperaba 'failed', se obtuvo '$FINAL2_STATUS'${NC}"
    fi
else
    FINAL2=$(get_transaction "$TXN2_ID")
    FINAL2_STATUS=$(echo "$FINAL2" | jq -r '.data.status')
    echo -e "${RED}❌ TEST 2 FAILED: Timeout o estado incorrecto. Estado actual: $FINAL2_STATUS${NC}"
fi

echo ""
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 3: Verificar que ambos están en BD${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}➜ Consultando transacción 1...${NC}"
CHECK1=$(get_transaction "$TXN1_ID")
if echo "$CHECK1" | jq -e '.data.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Transacción 1 encontrada en BD${NC}"
else
    echo -e "${RED}✗ Transacción 1 NO encontrada en BD${NC}"
fi

echo -e "${YELLOW}➜ Consultando transacción 2...${NC}"
CHECK2=$(get_transaction "$TXN2_ID")
if echo "$CHECK2" | jq -e '.data.id' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Transacción 2 encontrada en BD${NC}"
else
    echo -e "${RED}✗ Transacción 2 NO encontrada en BD${NC}"
fi

echo ""
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RESUMEN DE RESULTADOS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Transacción 1 (amount < 1000):"
echo "$FINAL1" | jq '{
    id: .data.id,
    externalId: .data.externalId,
    amount: .data.amount,
    status: .data.status,
    type: .data.type,
    createdAt: .data.createdAt
}'
echo ""
echo -e "Transacción 2 (amount > 1000):"
echo "$FINAL2" | jq '{
    id: .data.id,
    externalId: .data.externalId,
    amount: .data.amount,
    status: .data.status,
    type: .data.type,
    createdAt: .data.createdAt
}'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TODAS LAS PRUEBAS COMPLETADAS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
