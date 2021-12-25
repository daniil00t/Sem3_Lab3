#pragma once

#include <stdexcept>

template<class T>
class Optional {
private:
	bool hasValue;
	T value;
public:
	Optional():
		hasValue(false), value(T())
	{}

	Optional(T value):
		hasValue(true), value(value)
	{}

	Optional(const Optional<T>& op):
		hasValue(op.hasValue), value(op.value)
	{}
public:
	bool HasValue()
	{
		return hasValue;
	}
	T& GetValue()
	{
		if (hasValue)
			return value;
		else
			throw std::runtime_error("Optional object has no value!");
	}
	T& operator*()
	{
		return GetValue();
	}
	void SetValue(T value)
	{
		hasValue = true;
		this->value = value;
	}
	T& PopValue()
	{
		T& res = GetValue();

		hasValue = false;

		return res;
	}
};