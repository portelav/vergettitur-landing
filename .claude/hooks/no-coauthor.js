#!/usr/bin/env node
// PreToolUse hook: bloqueia QUALQUER commit com co-author / assinatura de agente.
// Regra do dono: commits sempre só do autor, nunca "Co-Authored-By: Claude" etc.
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let cmd = "";
  try {
    const input = JSON.parse(raw || "{}");
    if (input.tool_name !== "Bash") return ok();
    cmd = String(input.tool_input?.command || "");
  } catch {
    return ok();
  }

  if (!/\bgit\s+commit\b/i.test(cmd)) return ok();

  const forbidden = [
    /co-authored-by/i,
    /noreply@anthropic/i,
    /generated with\s+\[?claude/i,
    /🤖\s*generated/i,
  ];
  if (forbidden.some((re) => re.test(cmd))) {
    return deny(
      "Commit bloqueado: regra do projeto proíbe co-author/assinatura de agente. " +
        "Refaça o commit SEM nenhuma linha 'Co-Authored-By', 'Generated with Claude' ou similar."
    );
  }
  return ok();
});

function ok() {
  process.exit(0);
}
function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}
