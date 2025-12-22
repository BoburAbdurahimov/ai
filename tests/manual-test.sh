#!/bin/bash
# Manual testing script for AI Call Center MVP
# Usage: ./tests/manual-test.sh https://your-app.vercel.app

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 AI Call Center MVP - Manual Test Suite"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_code=$5

    echo -n "Testing: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_code, got $http_code)"
        echo "Response: $body"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "=== 1. Health Check ==="
test_endpoint "Health endpoint" "GET" "/api/health" "" "200"
echo ""

echo "=== 2. Call Start Webhook ==="
test_endpoint "Call start - valid" "POST" "/api/webhooks/call-start" \
    '{"callId":"test_001","callerNumber":"+998901234567","timestamp":"2024-12-22T10:00:00Z"}' \
    "200"

test_endpoint "Call start - missing callId" "POST" "/api/webhooks/call-start" \
    '{"callerNumber":"+998901234567"}' \
    "400"
echo ""

echo "=== 3. Call Input Webhook - DTMF ==="
test_endpoint "DTMF - Russian (1)" "POST" "/api/webhooks/call-input" \
    '{"callId":"test_001","inputType":"dtmf","input":"1"}' \
    "200"

test_endpoint "DTMF - Uzbek (2)" "POST" "/api/webhooks/call-input" \
    '{"callId":"test_002","inputType":"dtmf","input":"2"}' \
    "200"

test_endpoint "DTMF - invalid digit" "POST" "/api/webhooks/call-input" \
    '{"callId":"test_003","inputType":"dtmf","input":"9"}' \
    "200"
echo ""

echo "=== 4. Call Input Webhook - Speech ==="
# Note: This will fail without actual audio data and STT setup
echo -e "${YELLOW}⚠ Speech test requires full Yandex setup (skipping)${NC}"
echo ""

echo "=== 5. Call End Webhook ==="
test_endpoint "Call end - completed" "POST" "/api/webhooks/call-end" \
    '{"callId":"test_001","duration":180,"endReason":"completed","timestamp":"2024-12-22T10:03:00Z"}' \
    "200"

test_endpoint "Call end - missing callId" "POST" "/api/webhooks/call-end" \
    '{"duration":180}' \
    "400"
echo ""

echo "=== 6. Cron Endpoints ==="
test_endpoint "Daily summary (without secret)" "GET" "/api/cron/daily-summary" "" "401"
echo -e "${YELLOW}⚠ To test with secret: curl -H 'x-cron-secret: YOUR_SECRET' $BASE_URL/api/cron/daily-summary${NC}"
echo ""

echo "========================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
