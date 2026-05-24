// Settle Up — computes the minimum set of transactions that bring every
// member's net balance to zero. Tap "I paid" on a row to record the cash
// transfer. WhatsApp share opens a pre-filled message to the recipient.

function ScreenSettleUp({ back }) {
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const expenses = window.EXPENSES || [];
  const settlements = window.SETTLEMENTS || [];
  const [tick, setTick] = React.useState(0);  // force re-render after a settlement
  const [recording, setRecording] = React.useState(null);  // transfer being recorded

  if (!trip) return null;

  // Compute everyone's balance + minimal transactions
  const memberIds = members.map((m) => m.id);
  const balances = window.computeAllBalances?.(memberIds, expenses, settlements) || {};
  const transfers = window.computeSettlements?.(balances) || [];
  const fmt = (usd) => window.fmtMoney(usd, { in: 'home' });
  const findMember = (id) =>
    members.find((m) => m.id === id) ||
    { id, name: id === window.currentUserId ? (window.isRTL ? 'أنت' : 'You') : '—', hue: 200, initials: '?' };

  const handleMarkPaid = (transfer) => {
    const fromM = findMember(transfer.from);
    const toM = findMember(transfer.to);
    const amount = fmt(transfer.amount);
    window.actionSheet?.({
      title: t('settleConfirmTitle'),
      message: t('settleConfirmMsg')
        .replace('{from}', fromM.name.split(' ')[0])
        .replace('{to}', toM.name.split(' ')[0])
        .replace('{amount}', amount),
      actions: [{
        label: t('settleConfirmYes'),
        destructive: false,
        onPress: async () => {
          setRecording(transfer.from + '>' + transfer.to);
          try {
            await window.recordSettlement(trip.id, transfer.from, transfer.to, transfer.amount);
            window.toast?.(window.isRTL ? 'تم تسجيل الدفع' : 'Payment recorded', 'success');
            setTick((n) => n + 1);
          } catch (err) {
            window.toast?.(err.message || 'Could not record', 'error');
          } finally {
            setRecording(null);
          }
        },
      }],
    });
  };

  const handleShare = (transfer) => {
    const toM = findMember(transfer.to);
    const amount = fmt(transfer.amount);
    const msg = t('settleWhatsappCopy')
      .replace('{to}', toM.name.split(' ')[0])
      .replace('{amount}', amount);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div data-screen-label="Settle Up" style={{
      background: 'var(--cream)', minHeight: '100%', paddingBottom: 100,
    }}>
      <LargeTitleHeader
        title={t('settleUp')}
        subtitle={trip.title}
        onBack={back}
      />

      {/* No transfers needed */}
      {transfers.length === 0 ? (
        <div style={{
          padding: '60px 24px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center', gap: 12,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, var(--moss) 0%, oklch(0.40 0.08 155) 100%)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 14px 32px oklch(0.50 0.08 155 / 0.4)',
          }}>
            <IconCheck size={40} stroke="#fff" />
          </div>
          <div className="serif-italic" style={{ fontSize: 28, color: 'var(--ink)', lineHeight: 1.1 }}>
            {t('settleAllSettled')}
          </div>
          {expenses.length === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', maxWidth: 240 }}>
              {t('settleNoActivity')}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '4px 14px 0' }}>
          {/* Summary card */}
          <div style={{
            background: 'var(--statement)', color: 'var(--statement-fg)',
            borderRadius: 22, padding: '16px 18px',
            marginBottom: 16, position: 'relative', overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(60% 50% at 90% 0%, oklch(0.45 0.10 35 / 0.4) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', opacity: 0.78 }}>
                {t('settleTransactions').toUpperCase()}
              </div>
              <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, marginTop: 4 }}>
                {t('settleSummary').replace('{n}', transfers.length)
                  .replace(/\{n,plural,one\{[^}]+\}other\{([^}]+)\}\}/, transfers.length === 1
                    ? (window.isRTL ? 'تحويل' : 'transaction')
                    : (window.isRTL ? 'تحويلات' : 'transactions'))}
              </div>
            </div>
          </div>

          {/* Transfer list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transfers.map((tr, i) => {
              const fromM = findMember(tr.from);
              const toM = findMember(tr.to);
              const isMe = tr.from === window.currentUserId || tr.to === window.currentUserId;
              const recordingThis = recording === (tr.from + '>' + tr.to);
              return (
                <div key={i} style={{
                  background: isMe ? 'var(--cream-2)' : 'var(--cream-2)',
                  borderRadius: 18, padding: '14px 16px',
                  border: isMe ? '0.5px solid var(--clay)' : '0.5px solid var(--hairline)',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  {/* Avatars + flow */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    flexDirection: 'row',
                  }}>
                    <Avatar m={fromM} size={36} />
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      flex: 1, gap: 2,
                    }}>
                      <span className="icon-flip" style={{ color: 'var(--clay)' }}>
                        <IconChevron size={20} stroke="currentColor" />
                      </span>
                      <span className="mono" style={{
                        fontSize: 16, fontWeight: 700, color: 'var(--ink)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>{fmt(tr.amount)}</span>
                    </div>
                    <Avatar m={toM} size={36} />
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 11.5, color: 'var(--ink-mute)',
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fromM.name.split(' ')[0]} {window.isRTL ? '→' : '→'} {toM.name.split(' ')[0]}
                    </span>
                  </div>
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleShare(tr)} style={{
                      flex: 1, padding: '10px', borderRadius: 12,
                      background: 'var(--cream)', border: '0.5px solid var(--hairline-2)',
                      color: 'var(--ink-soft)', fontSize: 12.5, fontWeight: 500,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <IconShare size={13} stroke="currentColor" /> {t('settleShare')}
                    </button>
                    <button
                      onClick={() => handleMarkPaid(tr)}
                      disabled={recordingThis}
                      style={{
                        flex: 1.2, padding: '10px', borderRadius: 12,
                        background: recordingThis ? 'var(--ink-mute)' : 'var(--ink)',
                        color: 'var(--cream)', fontSize: 12.5, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      }}>
                      <IconCheck size={13} stroke="currentColor" />
                      {recordingThis ? '…' : t('settleMarkPaid')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {settlements.length > 0 && (
        <div style={{ padding: '24px 14px 0' }}>
          <SectionLabel>{t('settleHistoryTitle')}</SectionLabel>
          <div style={{
            background: 'var(--cream-2)', borderRadius: 22, overflow: 'hidden',
            border: '0.5px solid var(--hairline)', margin: '0 8px',
          }}>
            {settlements.map((s, i) => {
              const fromM = findMember(s.from_user);
              const toM = findMember(s.to_user);
              const canDelete = s.created_by === window.currentUserId;
              return (
                <SwipeRow key={s.id}
                  actions={canDelete ? [
                    { key: 'delete', bg: 'var(--clay)', icon: <IconTrash size={18} stroke="#fff" /> },
                  ] : []}
                  onAction={async (key) => {
                    if (key !== 'delete') return;
                    if (!confirm(window.isRTL ? 'حذف هذا التحويل؟' : 'Undo this transfer?')) return;
                    try { await window.deleteSettlement(s.id, trip?.id); }
                    catch (err) { window.toast?.(err.message || 'Failed', 'error'); }
                  }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: 'var(--cream-2)',
                    borderTop: i > 0 ? '0.5px solid var(--hairline)' : 'none',
                    flexDirection: 'row',
                  }}>
                    <Avatar m={fromM} size={26} />
                    <span className="icon-flip" style={{ color: 'var(--ink-mute)' }}>
                      <IconChevron size={14} stroke="currentColor" />
                    </span>
                    <Avatar m={toM} size={26} />
                    <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-soft)' }}>
                      {fromM.name.split(' ')[0]} {window.isRTL ? '←' : '→'} {toM.name.split(' ')[0]}
                    </div>
                    <span className="mono" style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--ink)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>{fmt(parseFloat(s.amount_usd) || 0)}</span>
                  </div>
                </SwipeRow>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

window.ScreenSettleUp = ScreenSettleUp;
