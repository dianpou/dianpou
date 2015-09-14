<?php namespace App\Models;


class Reject extends Model {
    public function getValidations() {
        return array(
            'order_id' => 'required|integer',
            'user_id' => 'required|integer',
            'reject_sn' => 'required|unique:rejects,reject_sn' . $this->uniqueExcept(),
        );
    }
    public function order()
    {
        return $this->belongsTo('App\Models\Order');
    }
    public function products()
    {
        return $this->hasMany('App\Models\RejectProduct', 'reject_id');
    }
    public function logs()
    {
        return $this->hasMany('App\Models\RejectLog', 'reject_id');
    }
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function result()
    {
        return $this->morphTo();
    }

    public function save(array $options = array())
    {
        if (!$this->reject_sn) {
            $this->reject_sn = uniqid();
        }
        parent::save($options);
    }
    /**
     * 使用指定的operate操作订单
     * @param  string $operate 操作名称
     * @param  array  $data    操作数据
     * @return boolean          操作结果
     */
    public function operate($operator, $status, $data = array())
    {
        if (!$this->operable($operator, $operate)) {
            throw new \Exception('Permission denied!');
        }
        switch ($operate) {
            case 'confirmed':
                $this->status = $status;
                // 生成退款单或换货用新订单

                break;
            case 'shipped':
                $this->status = $status;
                $this->tracking_no = $data['tracking_no'];
            case 'completed':
                $this->status = $status;
                // 解锁订单
                $this->order->unlock($operator, function ($order, $params) use($operator) {
                    if ($params['next_status']) {
                        $order->operate($operator, $params['next_status']);
                    }
                });
                break;
            case 'canceled':
                $this->status = $status;
                $this->order->unlock($operator);
                $this->result->operate($operator, 'canceled');
                break;
            default:
                throw new \Exception("Operate {$operate} is undefined");
                break;
        }
        if ($this->isDirty()) {
            $this->log($operator, $data['remark']);
            $this->save();
        }

        return $this;
    }

    /**
     * 获取指定$operate的可操作状态
     * @param  object $operator 操作者实例
     * @param  string $status 操作名称
     * @return boolean false：不可操作 true可操作
     */
    public function operable($operator, $status)
    {
        $operator_type = $operator->getOperatorType();
        switch ($status) {
            case 'confirmed':
                return $operator_type === 'Admin' && in_array($this->status, array('pending'));
                break;
            case 'shipped':
                return $operator_type === 'Admin' && in_array($this->status, array('confirmed'));
                break;
            case 'completed':
                return $operator_type === 'Admin' && in_array($this->status, array('shipped'));
                break;
            case 'canceled':
                return in_array($this->status, array('pending'));
                break;
            default:
                throw new \Exception("Operate {$operate} is undefined");
                break;
        }
    }

    public function log($operator, $remark = '', $changed = null)
    {
        $changed = $changed ? $changed : $this->getDirty();

        if (!$changed) {
            throw new \Exception('nothing_to_log');
        }

        $from = array();

        foreach ($changed as $key => $value) {
            $from[$key] = $this->getOriginal($key);
        }

        $this->logs()->create([
            'operator_type' => $operator->getOperatorType(),
            'operator_id' => $operator->getOperatorId(),
            'operate_content' => [
                'from' => $from,
                'to'   => $changed
            ],
            'operate_remark' => $remark
        ]);
    }
}
