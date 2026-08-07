import { useState, useEffect } from 'react';
import { Route } from './+types/kortz';
import { Form, useFetcher } from "react-router";
import { TrashIcon } from '@heroicons/react/24/outline';
import { Item, ItemRequest, ItemCalcResponse } from 'lib/types';
import * as F from 'server/facade';

const ITEM_LIST: Item[] = [
  { name: "展厅手镯", type: "scattered", location: "showroom", value: 0, isAvailable: true },
  { name: "陨石", type: "whole", location: "showroom", value: 0, isAvailable: true },
  { name: "展厅女神", type: "whole", location: "showroom", value: 0, isAvailable: true },
  { name: "钻石", type: "showcase", location: "showroom", value: 0, isAvailable: true },
  { name: "维纳斯", type: "showcase", location: "showroom", value: 0, isAvailable: true },
  { name: "线条", type: "painting", location: "showroom", value: 0, isAvailable: true },
  { name: "工厂", type: "painting", location: "showroom", value: 0, isAvailable: true },

  { name: "2楼手镯", type: "scattered", location: "secondFloor", value: 0, isAvailable: true },
  { name: "2楼蛋", type: "whole", location: "secondFloor", value: 0, isAvailable: true },
  { name: "项链", type: "showcase", location: "secondFloor", value: 0, isAvailable: true },
  { name: "马", type: "showcase", location: "secondFloor", value: 0, isAvailable: true },
  { name: "漫画", type: "painting", location: "secondFloor", value: 0, isAvailable: true },
  { name: "枪", type: "painting", location: "secondFloor", value: 0, isAvailable: true },

  { name: "1楼探头戒指", type: "scattered", location: "firstFloor", value: 0, isAvailable: true },
  { name: "1楼戒指", type: "scattered", location: "firstFloor", value: 0, isAvailable: true },
  { name: "1楼梯边戒指", type: "scattered", location: "firstFloor", value: 0, isAvailable: true },
  { name: "1楼手镯", type: "scattered", location: "firstFloor", value: 0, isAvailable: true },
  { name: "1楼墙边手镯", type: "scattered", location: "firstFloor", value: 0, isAvailable: true },
  { name: "1楼女神", type: "whole", location: "firstFloor", value: 0, isAvailable: true },
  { name: "蓝底小人", type: "painting", location: "firstFloor", value: 0, isAvailable: true },
  { name: "变形小人", type: "painting", location: "firstFloor", value: 0, isAvailable: true },
  { name: "两个女人", type: "painting", location: "firstFloor", value: 0, isAvailable: true },
  { name: "抽象牛", type: "painting", location: "firstFloor", value: 0, isAvailable: true },
  { name: "橘子树", type: "painting", location: "firstFloor", value: 0, isAvailable: true },
  { name: "人像", type: "painting", location: "firstFloor", value: 0, isAvailable: true },

  { name: "0楼手镯", type: "scattered", location: "groundFloor", value: 0, isAvailable: true },
  { name: "0楼蛋", type: "whole", location: "groundFloor", value: 0, isAvailable: true },
  { name: "骷髅头", type: "showcase", location: "groundFloor", value: 0, isAvailable: true },

  { name: "秋千", type: "painting", location: "vault", value: 0, isAvailable: true },
  { name: "猎人", type: "painting", location: "vault", value: 0, isAvailable: true },
  { name: "仙人掌", type: "painting", location: "vault", value: 0, isAvailable: true },
  { name: "狗", type: "painting", location: "vault", value: 0, isAvailable: true },
  { name: "钱袋", type: "showcase", location: "vault", value: 12.5, isAvailable: true },
];

const ITEM_VOLUME: Record<string, number> = {
  scattered: 1,
  whole: 2,
  showcase: 3,
  painting: 5,
}

const LOCATION_LABELS: Record<string, string> = {
  showroom: "展厅",
  secondFloor: "2楼",
  firstFloor: "1楼",
  groundFloor: "0楼",
  vault: "地下室",
};

const TYPE_LABELS: Record<string, string> = {
  scattered: "零散",
  whole: "整体",
  showcase: "高柜",
  painting: "画",
};

const locations = ["showroom", "secondFloor", "firstFloor", "groundFloor", "vault"];

export async function action({ request }: Route.ActionArgs) {
  const contentType = request.headers.get("content-type");

  let formData = new FormData();

  if ( !contentType?.startsWith("application/x-www-form-urlencoded")) {
    return { formData };
  } else {
    formData = await request.formData();
  }

  const itemRequest: ItemRequest = JSON.parse(formData.get("itemRequest") as string);
  
  const result = await F.calcItems({ ...itemRequest });
  return result;
}

export async function loader() {
  try {
    const healthData = await F.checkHealth();
    return { healthy: true, healthData, error: null };
  } catch (err) {
    return { healthy: false, healthData: null, error: err instanceof Error ? err.message : String(err) };
  }
}

export default function Kortz({ loaderData }: Route.ComponentProps) {
  const [items, setItems] = useState<(Item & { isRequired?: boolean })[]>(ITEM_LIST);
  const [lastItems, setLastItems] = useState<Item[]>();
  const [actionData, setActionData] = useState<ItemCalcResponse[]>();
  const [showTooltip, setShowTooltip] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      setActionData(fetcher.data as ItemCalcResponse[]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (actionData && actionData.length > 0) {
      const allItems = actionData.flatMap(r => r.selectedItems || []);
      setLastItems(allItems);
    }
  }, [actionData])

  const getItemsByLocation = (location: string): (Item & { isRequired?: boolean })[] => {
    return items.filter(item => item.location === location);
  };

  const handleValueChange = (index: number, value: number) => {
    const currentItems = items || ITEM_LIST;
    if (index < 0 || index >= currentItems.length) {
      return;
    }
    const newItems = [...currentItems];
    const item = newItems[index];
    if (!item) {
      return;
    }
    item.value = value;
    setItems(newItems);
  };

  const handleToggleAvailable = (index: number) => {
    const currentItems = items || ITEM_LIST;
    if (index < 0 || index >= currentItems.length) {
      return;
    }
    const newItems = [...currentItems];
    const item = newItems[index];
    if (!item) {
      return;
    }
    item.isAvailable = !item.isAvailable;
    setItems(newItems);
  };

  const handleToggleRequired = (index: number) => {
    const currentItems = items || ITEM_LIST;
    if (index < 0 || index >= currentItems.length) {
      return;
    }
    const newItems = [...currentItems];
    const item = newItems[index];
    if (!item) {
      return;
    }
    (item as any).isRequired = !(item as any).isRequired;
    setItems(newItems);
  };

  const getItemIndex = (location: string, itemIndex: number): number => {
    const locationIndex = locations.indexOf(location);
    let count = 0;
    for (let i = 0; i < locationIndex; i++) {
      count += ITEM_LIST.filter(item => item.location === locations[i]).length;
    }
    return count + itemIndex;
  };

  const handleClearResults = () => {
    const newItems = ITEM_LIST.map(item => ({ ...item }));
    if (lastItems) {
      const lastItemNames = new Set(lastItems.map(item => item.name));
      newItems.forEach(item => {
        if (lastItemNames.has(item.name)) {
          item.isAvailable = item.name !== '钱袋' ? false : true;
        } else {
          item.isAvailable = true;
        }
        item.value = item.name === '钱袋' ? item.value : 0;
        delete (item as any).isRequired;
      });
    }
    setItems(newItems);
    setActionData(undefined);
    setLastItems(undefined);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    
    const itemRequest: ItemRequest = { 
      multiPlayer: playerCount !== 1, 
      playerCount: playerCount,
      items: items.map(({ isRequired, ...item }) => ({ 
        ...item, 
        volume: ITEM_VOLUME[item.type || 'scattered'] || 0 
      })), 
      requiredItems: items.filter(item => item.isRequired).map(({ isRequired, ...item }) => ({ 
        ...item, 
        volume: ITEM_VOLUME[item.type || 'scattered'] || 0 
      })) 
    }; 
    
    const formData = new FormData(); 
    formData.set('itemRequest', JSON.stringify(itemRequest)); 
    
    fetcher.submit(formData, { 
      method: 'POST', 
      encType: 'application/x-www-form-urlencoded'
    }); 
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '40px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: loaderData.healthy ? '#27ae60' : '#e74c3c',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            right: '40px',
            background: '#2c3e50',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1001,
            minWidth: '200px',
          }}
        >
          {loaderData.healthData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>状态:</strong> {loaderData.healthData.status}</div>
              <div><strong>时间:</strong> {loaderData.healthData.timestamp}</div>
              <div><strong>服务:</strong> {loaderData.healthData.service}</div>
              <div><strong>版本:</strong> {loaderData.healthData.version}</div>
            </div>
          ) : (
            <div style={{ color: '#e74c3c' }}>
              <strong>错误:</strong> {loaderData.error || '未知错误'}
            </div>
          )}
        </div>
      )}
      <Form onSubmit={handleSubmit} style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif', background: '#f5f7fa' }}>
        <h1 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>
          💎 科兹中心豪劫物品价值分析器
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <span style={{ fontSize: '15px', color: '#2c3e50', fontWeight: 'bold' }}>👥 玩家数量:</span>
          <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '6px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => setPlayerCount(count)}
                style={{
                  padding: '10px 22px',
                  border: 'none',
                  borderRadius: '7px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: playerCount === count ? '#3498db' : 'transparent',
                  color: playerCount === count ? '#fff' : '#7f8c8d',
                  boxShadow: playerCount === count ? '0 2px 8px rgba(52, 152, 219, 0.4)' : 'none',
                  transform: playerCount === count ? 'translateY(-1px)' : 'none',
                }}
                onMouseOver={(e) => {
                  if (playerCount !== count) {
                    e.currentTarget.style.background = '#ecf0f1';
                    e.currentTarget.style.color = '#2c3e50';
                  }
                }}
                onMouseOut={(e) => {
                  if (playerCount !== count) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#7f8c8d';
                  }
                }}
              >
                {count}P
              </button>
            ))}
          </div>
        </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {locations.map(location => (
          <div
            key={location}
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '15px',
              minWidth: '200px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderTop: '3px solid #3498db',
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
              {LOCATION_LABELS[location]}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {getItemsByLocation(location).map((item, itemIndex) => {
                const index = getItemIndex(location, itemIndex);
                const isRequired = item.isRequired;
                return (
                  <div
                    key={index}
                    onClick={() => handleToggleAvailable(index)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      background: item.isAvailable ? (isRequired ? '#fff3cd' : '#f8f9fa') : '#f0f0f0',
                      borderRadius: '4px',
                      opacity: item.isAvailable ? 1 : 0.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderLeft: isRequired ? '3px solid #ffc107' : '3px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#34495e', textDecoration: item.isAvailable ? 'none' : 'line-through' }}>
                      {item.name} ({TYPE_LABELS[item.type || ''] || item.type || ''})
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        onClick={(e) => { e.stopPropagation(); handleToggleRequired(index); }}
                        style={{
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {isRequired ? '★' : '☆'}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.value || ''}
                        onChange={(e) => handleValueChange(index, parseFloat(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={!item.isAvailable || item.name === "钱袋"}
                        style={{
                          width: '70px',
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center',
                          color: item.value > 0 ? '#27ae60' : '#95a5a6',
                          fontWeight: 'bold',
                          cursor: item.isAvailable ? 'text' : 'not-allowed',
                          backgroundColor: item.isAvailable ? '#fff' : '#f5f5f5',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          type="submit"
          style={{
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '14px 50px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(52, 152, 219, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(52, 152, 219, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
          }}
        >
          💎 一键分析最优解
        </button>
      </div>

      {actionData && actionData.length > 0 && (
        <div style={{ marginTop: '30px', position: 'relative' }}>
          <button
            type="button"
            onClick={handleClearResults}
            style={{
              position: 'absolute',
              top: '0',
              right: '20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
            }}
            title="清除结果"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fee'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <TrashIcon style={{ width: '24px', height: '24px', color: '#e74c3c' }} />
          </button>
          <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#2c3e50', fontSize: '22px', fontWeight: 'bold' }}>
            📊 分析结果
          </h3>

          {actionData[0]?.totalValueAllPlayers != null && (
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #27ae60, #2ecc71)', color: '#fff', borderRadius: '12px', padding: '20px 50px', boxShadow: '0 4px 16px rgba(39, 174, 96, 0.3)' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px', opacity: 0.9 }}>
                  {actionData.length > 1 ? '👥 所有玩家总价值' : '💰 总价值'}
                </div>
                <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{actionData[0].totalValueAllPlayers}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {actionData.map((playerResult, playerIdx) => {
            const isMulti = actionData.length > 1;
            return (
            <div key={playerIdx} style={{ flex: isMulti ? '1 1 0' : '1 1 100%', minWidth: isMulti ? '280px' : 'auto', maxWidth: isMulti ? '600px' : 'none', border: isMulti ? '1px solid #e0e0e0' : 'none', borderRadius: isMulti ? '10px' : '0', overflow: 'hidden' }}>
              {isMulti && (
              <div style={{ background: '#3498db', color: '#fff', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>👤 玩家 {playerIdx + 1}</span>
                <span style={{ fontSize: '14px' }}>总价值: {playerResult.totalValue}</span>
              </div>
              )}

              <div style={{ display: 'flex', gap: '8px', padding: '15px' }}>
                <div style={{ flex: '1 1 0', background: '#fff', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '3px solid #3498db' }}>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>选中物品数</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{playerResult.selectedItemCount}</div>
                </div>
                <div style={{ flex: '1 1 0', background: '#fff', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '3px solid #e74c3c' }}>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>剩余容量</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{playerResult.remainingVolume}</div>
                </div>
                <div style={{ flex: '1 1 0', background: '#fff', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '3px solid #27ae60' }}>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>总价值</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{playerResult.totalValue}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '0 15px 15px' }}>
                {locations.map(location => {
                  const locationItems = (playerResult.selectedItems || []).filter(item => item.location === location);
                  if (locationItems.length === 0) return null;
                  return (
                    <div
                      key={location}
                      style={{
                        width: '100%',
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        borderTop: '3px solid #27ae60',
                      }}
                    >
                      <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '14px', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '6px' }}>
                        {LOCATION_LABELS[location]}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {locationItems.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(15, 1fr)',
                              alignItems: 'center',
                              padding: '8px',
                              background: '#f8f9fa',
                              borderRadius: '4px',
                            }}
                          >
                            <span style={{ gridColumn: '1 / span 8', textAlign: 'left', fontSize: '12px', color: '#34495e' }}>
                              {item.name} ({TYPE_LABELS[item.type || ''] || item.type || ''})
                            </span>
                            <span style={{ gridColumn: '9 / span 3', textAlign: 'center', fontSize: '11px', color: '#7f8c8d', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '3px' }}>
                              容量: {item.volume}
                            </span>
                            <span style={{ gridColumn: '14 / span 2', textAlign: 'right', fontSize: '13px', color: '#27ae60', fontWeight: 'bold' }}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}
          </div>
        </div>
      )}

    </Form>
    </div>
  );
}