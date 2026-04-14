<?php
header('Content-Type: application/json');
ignore_user_abort(true);
set_time_limit(0);

/* ---------------------------------------------------------
 *   JSON HELPERS
 * --------------------------------------------------------- */

function decode_json($raw) {
    $d = json_decode($raw, true);
    return (json_last_error() === JSON_ERROR_NONE) ? $d : false;
}

/* Sanitize:
   - Allowed: A-Z a-z 0-9 _ . - + = & { } % [ ] space
   - Everything else → %XX (uppercase hex)
*/
function sanitize_php($str) {
    $out = "";
    $len = strlen($str);

    for ($i = 0; $i < $len; $i++) {
        $c = $str[$i];

        if (preg_match('/[A-Za-z0-9_\.\-\+\=\&\{\}\%

\[\]

 ]/', $c)) {
            $out .= $c;
        } else {
            $out .= sprintf("%%%02X", ord($c));
        }
    }

    return $out;
}

/* Normalize:
   - convert ints/bools/floats to strings
   - sanitize each string
   - preserve list or list-of-lists structure
*/
function normalize($data) {
    if (!is_array($data)) return sanitize_php(strval($data));

    $out = [];
    foreach ($data as $item) {
        if (is_array($item)) {
            $sub = [];
            foreach ($item as $s) $sub[] = sanitize_php(strval($s));
            $out[] = $sub;
        } else {
            $out[] = sanitize_php(strval($item));
        }
    }
    return $out;
}

/* Bash-safe JSON:
   - list of strings
   - OR list of lists of strings
*/
function validate_bash_json($data) {
    if (!is_array($data)) return false;

    foreach ($data as $item) {
        if (is_string($item)) continue;

        if (is_array($item)) {
            foreach ($item as $s) {
                if (!is_string($s)) return false;
            }
            continue;
        }

        return false;
    }

    return true;
}

/* Macro steps: list of lists of strings */
function validate_macro_steps($steps) {
    if (!is_array($steps)) return false;
    foreach ($steps as $step) {
        if (!is_array($step)) return false;
        foreach ($step as $s) {
            if (!is_string($s)) return false;
        }
    }
    return true;
}

/* write_macros: { name: list-of-lists } */
function validate_macro_file($obj) {
    if (!is_array($obj)) return false;
    foreach ($obj as $name => $steps) {
        if (!is_string($name)) return false;
        if (!validate_macro_steps($steps)) return false;
    }
    return true;
}

/* ---------------------------------------------------------
 *   MODE DEFINITIONS
 * --------------------------------------------------------- */

$DEFAULT = ["needs_json" => true, "validator" => "validate_bash_json"];

$MODES = [
    "macro"            => ["validator" => "validate_macro_steps"],
"list"             => ["needs_json" => false],
"status"           => ["needs_json" => false],
"stop"             => ["needs_json" => false],
"write_macros"     => ["validator" => "validate_macro_file"],

// Allow ANY JSON for these:
"write_displays"   => ["needs_json" => true, "validator" => null],
"write_activities" => ["needs_json" => true, "validator" => null],
"write_modules"    => ["needs_json" => true, "validator" => null]
];

function cfg($mode, $MODES, $DEFAULT) {
    return isset($MODES[$mode]) ? array_merge($DEFAULT, $MODES[$mode]) : false;
}

/* ---------------------------------------------------------
 *   PASSTHROUGH
 * --------------------------------------------------------- */

function passthrough($mode, $json_raw, $id) {
    $post = "mode=" . urlencode($mode);
    if ($id !== "") $post .= "&id=" . urlencode($id);
    if ($json_raw !== "") $post .= "&json=" . urlencode($json_raw);

    $ch = curl_init("http://127.0.0.1:4343");
    curl_setopt_array($ch, [
        CURLOPT_TIMEOUT => 10,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post
    ]);

    $resp = curl_exec($ch);
    if (curl_errno($ch)) {
        echo json_encode(["success" => false, "error" => curl_error($ch)]);
        curl_close($ch);
        return;
    }
    curl_close($ch);
    echo $resp;
}

/* ---------------------------------------------------------
 *   MAIN DISPATCHER
 * --------------------------------------------------------- */

if (!isset($_REQUEST['mode'])) {
    echo json_encode(["success" => false, "error" => "No mode provided"]);
    exit;
}

$mode = $_REQUEST['mode'];
$id   = $_REQUEST['id']   ?? "";
$raw  = $_REQUEST['json'] ?? "";

$cfg = cfg($mode, $MODES, $DEFAULT);
if ($cfg === false) {
    echo json_encode(["success" => false, "error" => "Invalid mode"]);
    exit;
}

if ($cfg["needs_json"]) {
    $decoded = decode_json($raw);
    if ($decoded === false) {
        echo json_encode(["success" => false, "error" => "Invalid JSON"]);
        exit;
    }

    if ($cfg["validator"]) {
        // Only macros use normalize + strict validation
        $decoded = normalize($decoded);
        if (!$cfg["validator"]($decoded)) {
            echo json_encode(["success" => false, "error" => "JSON validation failed"]);
            exit;
        }
        $raw = json_encode($decoded);
    } else {
        // Raw JSON passthrough for write_<data>
        $raw = json_encode($decoded);
    }
}

passthrough($mode, $raw, $id);
?>
